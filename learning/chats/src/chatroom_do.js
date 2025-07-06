// src/chatroom_do.js (修复版本)

/**
 * HibernatingChatRoom 是一个Durable Object，它负责管理单个聊天室的所有状态和逻辑。
 * 修复了WebSocket连接管理和RPC兼容性问题。
 */

import { DurableObject } from "cloudflare:workers";

// 定义消息类型常量
const MSG_TYPE_CHAT = 'chat';
const MSG_TYPE_DELETE = 'delete';
const MSG_TYPE_ERROR = 'error';
const MSG_TYPE_RENAME = 'rename';
const MSG_TYPE_OFFER = 'offer';
const MSG_TYPE_ANSWER = 'answer';
const MSG_TYPE_CANDIDATE = 'candidate';
const MSG_TYPE_CALL_END = 'call_end';

export class HibernatingChatRoom extends DurableObject {
    constructor(ctx, env) {
        super(ctx, env);
        this.ctx = ctx;
        this.env = env;
        this.messages = null;
        this.userStats = null;
    }

    // --- State Management ---
    async loadState() {
        if (this.messages !== null) return;
        this.messages = (await this.ctx.storage.get("messages")) || [];
        this.userStats = new Map(await this.ctx.storage.get("userStats")) || new Map();
        console.log(`DO State: Loaded. Messages: ${this.messages.length}`);
    }

    async saveState() {
        if (this.messages === null || this.userStats === null) return;
        await this.ctx.storage.put({
            messages: this.messages,
            userStats: [...this.userStats.entries()], 
        });
        console.log(`DO State: Saved. Messages: ${this.messages.length}`);
    }

    async cronPost(text, secret) {
        if (this.env.CRON_SECRET && secret !== this.env.CRON_SECRET) {
            console.error("CRON RPC: Unauthorized attempt!");
            return;
        }
        await this.loadState();
        console.log(`CRON RPC: Received post. Current messages: ${this.messages.length}`);
        await this.handleChatMessage({ username: "小助手" }, { text, type: 'text' });
        console.log(`CRON RPC: Post processed. New message count: ${this.messages.length}`);
    }

    // --- Main Fetch Handler ---
    async fetch(request) {
        const url = new URL(request.url);

        // API: 重置房间
        if (url.pathname.endsWith('/api/reset-room')) {
            const secret = url.searchParams.get('secret');
            if (this.env.ADMIN_SECRET && secret === this.env.ADMIN_SECRET) {
                await this.ctx.storage.deleteAll();
                this.messages = []; 
                this.userStats = new Map();
                return new Response("Room has been reset successfully.", { status: 200 });
            } else {
                return new Response("Forbidden.", { status: 403 });
            }
        }
        
        // API: 获取历史消息
        if (url.pathname.endsWith('/api/messages/history')) {
            await this.loadState();
            const since = parseInt(url.searchParams.get('since') || '0', 10);
            const history = this.fetchHistory(since);
            return new Response(JSON.stringify(history), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }
        
        // 【修复】正确处理 WebSocket 升级请求
        if (request.headers.get("Upgrade") === "websocket") {
            const username = url.searchParams.get("username") || "Anonymous";
            const { 0: client, 1: server } = new WebSocketPair();
            
            // 【修复】使用正确的 WebSocket Hibernation API
            this.ctx.acceptWebSocket(server, [username]);
            
            return new Response(null, { status: 101, webSocket: client });
        }

        // 页面加载请求
        if (request.method === 'GET') {
            return new Response(null, { headers: { 'X-DO-Request-HTML': 'true' } });
        }

        return new Response("Not Found", { status: 404 });
    }
    
    // --- WebSocket Event Handlers ---
    async webSocketOpen(ws) {
        await this.loadState();
        const tags = ws.getTags();
        console.log(`DO: WebSocket opened for user: ${tags[0]}`);
        
        // 发送欢迎消息和历史记录
        this.sendMessage(ws, { 
            type: 'welcome', 
            payload: { 
                message: `欢迎 ${tags[0]} 加入聊天室！`,
                history: this.messages.slice(-50) // 发送最近50条消息
            } 
        });
    }

    async webSocketMessage(ws, message) {
        await this.loadState();
        const username = ws.getTags()[0] || 'Anonymous';
        const user = { ws, username };
        
        try {
            const data = JSON.parse(message);
            console.log(`DO: Received message from ${username}:`, data.type);
            
            switch (data.type) {
                case MSG_TYPE_CHAT:
                    await this.handleChatMessage(user, data.payload);
                    break;
                case MSG_TYPE_DELETE:
                    await this.handleDeleteMessage(data.payload);
                    break;
                case MSG_TYPE_RENAME:
                    await this.handleRename(user, data.payload);
                    break;
                case MSG_TYPE_OFFER:
                case MSG_TYPE_ANSWER:
                case MSG_TYPE_CANDIDATE:
                case MSG_TYPE_CALL_END:
                    this.forwardRtcSignal(data.type, user, data.payload);
                    break;
                default:
                    console.warn(`DO: Unknown message type: ${data.type}`);
            }
        } catch (err) {
            console.error('DO: Failed to handle message:', err);
            this.sendMessage(ws, { 
                type: MSG_TYPE_ERROR, 
                payload: { message: `消息处理失败: ${err.message}` } 
            });
        }
    }

    async webSocketClose(ws, code, reason, wasClean) {
        const tags = ws.getTags();
        console.log(`DO: WebSocket closed for user: ${tags[0]}. Code: ${code}, Reason: "${reason}", Clean: ${wasClean}`);
    }
    
    async webSocketError(ws, error) {
        const tags = ws.getTags();
        console.error(`DO: WebSocket error for user ${tags[0]}:`, error);
    }

    // --- Core Logic & Handlers ---
    async handleChatMessage(user, payload) {
        try {
            console.log(`💬 Processing chat message from ${user.username}`);
            
            let message;
            const messageType = payload.type || 'text';

            if (messageType === 'image') {
                message = await this.createImageMessage(user, payload);
            } else if (messageType === 'audio') {
                message = await this.createAudioMessage(user, payload);
            } else {
                message = this.createTextMessage(user, payload);
            }

            // 添加消息到历史记录
            this.messages = [...this.messages, message];
            
            // 保持消息数量限制
            if (this.messages.length > 200) {
                this.messages = this.messages.slice(-200);
            }

            this.updateUserStatsOnMessage(user.username);
            
            // 先保存状态再广播
            await this.saveState();
            this.broadcast({ type: MSG_TYPE_CHAT, payload: message });
            
            console.log(`✅ Chat message processed successfully. ID: ${message.id}`);
        } catch (error) {
            console.error('❌ Error handling chat message:', error);
            if (user.ws) {
                this.sendMessage(user.ws, { 
                    type: MSG_TYPE_ERROR, 
                    payload: { message: `消息发送失败: ${error.message}` } 
                });
            }
        }
    }

    async handleDeleteMessage(payload) {
        const initialLength = this.messages.length;
        this.messages = this.messages.filter(m => m.id !== payload.id);
        
        if (this.messages.length < initialLength) {
            console.log(`🗑️ Message deleted. Count: ${initialLength} -> ${this.messages.length}`);
            await this.saveState();
            this.broadcast({ type: MSG_TYPE_DELETE, payload });
        }
    }

    async handleRename(user, payload) {
        console.log(`🏷️ User ${user.username} requested rename to ${payload.newName}`);
        // 可以添加重命名逻辑
    }

    // --- Helper Methods ---
    fetchHistory(since = 0) {
        return since > 0 ? this.messages.filter(msg => msg.timestamp > since) : this.messages;
    }

    updateUserStatsOnMessage(username) {
        const stats = this.userStats.get(username) || { messageCount: 0 };
        stats.messageCount = (stats.messageCount || 0) + 1;
        this.userStats.set(username, stats);
    }

    createTextMessage(user, payload) {
        return { 
            id: crypto.randomUUID(), 
            username: user.username, 
            timestamp: Date.now(), 
            text: payload.text,
            type: 'text'
        };
    }

    async createImageMessage(user, payload) {
        const imageUrl = await this.uploadToR2(payload.image, payload.filename, 'image');
        return { 
            id: crypto.randomUUID(), 
            username: user.username, 
            timestamp: Date.now(), 
            type: 'image', 
            imageUrl: imageUrl,
            filename: payload.filename,
            size: payload.size,
            caption: payload.caption 
        };
    }

    async createAudioMessage(user, payload) {
        const audioUrl = await this.uploadToR2(payload.audio, payload.filename, 'audio', payload.mimeType);
        return { 
            id: crypto.randomUUID(), 
            username: user.username, 
            timestamp: Date.now(), 
            type: 'audio', 
            audioUrl: audioUrl,
            filename: payload.filename,
            size: payload.size,
            mimeType: payload.mimeType
        };
    }

    async uploadToR2(data, filename, type, mimeType) {
        try {
            const base64Data = data.split(',')[1];
            if (!base64Data) throw new Error(`Invalid base64 data for ${type}`);
            
            const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            const extension = filename.split('.').pop() || 'bin';
            const key = `chat-${type}s/${Date.now()}-${crypto.randomUUID()}.${extension}`;
            
            await this.env.R2_BUCKET.put(key, buffer, {
                httpMetadata: { 
                    contentType: mimeType || (type === 'image' ? 'image/jpeg' : 'application/octet-stream'), 
                    cacheControl: 'public, max-age=31536000' 
                },
            });
            
            return `https://pub-8dfbdda6df204465aae771b4c080140b.r2.dev/${key}`;
        } catch (error) {
            console.error(`❌ R2 ${type} upload failed:`, error);
            throw new Error(`${type} 上传失败`);
        }
    }
    
    forwardRtcSignal(type, fromUser, payload) {
        // 【修复】使用正确的方法获取目标WebSocket
        const targetSockets = this.ctx.getWebSockets(payload.target);
        if (targetSockets.length > 0) {
            const targetWs = targetSockets[0];
            this.sendMessage(targetWs, { 
                type, 
                payload: { from: fromUser.username, ...payload } 
            });
        }
    }

    sendMessage(ws, message) {
        try { 
            ws.send(JSON.stringify(message)); 
        } catch (e) { 
            console.error("❌ Failed to send message to WebSocket:", e); 
        }
    }

    broadcast(message) {
        // 【修复】使用正确的方法遍历所有WebSocket连接
        const sockets = this.ctx.getWebSockets();
        console.log(`📢 Broadcasting to ${sockets.length} clients`);
        
        sockets.forEach(ws => {
            this.sendMessage(ws, message);
        });
    }
}