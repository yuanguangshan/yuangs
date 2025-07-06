// src/chatroom_do.js (Final RPC-enabled Version)

/**
 * HibernatingChatRoom 是一个Durable Object，它负责管理单个聊天室的所有状态和逻辑。
 * 它现在继承自 "cloudflare:workers" 的 DurableObject 类以支持 RPC。
 */

// 【重大修改】从 "cloudflare:workers" 导入 DurableObject 基类
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

// 【重大修改】类声明继承自 DurableObject
export class HibernatingChatRoom extends DurableObject {
    // 【重大修改】构造函数签名和 super() 调用
    constructor(ctx, env) {
        super(ctx, env); // 必须先调用 super
        this.ctx = ctx;   // this.ctx 包含了 state 和其他上下文
        this.env = env;
        this.messages = null;
        this.userStats = null;
    }

    // --- State Management ---
    async loadState() {
        if (this.messages !== null) return;
        console.log("DO State: Not in memory. Loading from storage...");
        // 【重大修改】通过 this.ctx.storage 访问存储
        const data = await this.ctx.storage.get(["messages", "userStats"]) || {};
        this.messages = data.messages || [];
        this.userStats = new Map(Object.entries(data.userStats || {}));
        console.log(`DO State: Loaded. Messages: ${this.messages.length}, Users: ${this.userStats.size}`);
    }

    async saveState() {
        if (this.messages === null || this.userStats === null) return;
        const serializableUserStats = Object.fromEntries(this.userStats);
        // 【重大修改】通过 this.ctx.storage 访问存储
        await this.ctx.storage.put({
            messages: this.messages,
            userStats: serializableUserStats,
        });
        console.log(`DO State: Saved. Messages: ${this.messages.length}`);
    }

    // --- RPC Method for Cron ---
    async cronPost(text, secret) {
        if (this.env.CRON_SECRET && secret !== this.env.CRON_SECRET) {
            console.error("CRON RPC: Unauthorized attempt!");
            return;
        }
        await this.loadState();
        console.log(`CRON RPC: Received post. Current messages: ${this.messages.length}`);
        const message = this.createTextMessage({ username: "小助手" }, { text });
        this.messages.push(message);
        if (this.messages.length > 200) this.messages.shift();
        this.broadcast({ type: 'chat', payload: message });
        await this.saveState();
        console.log(`CRON RPC: Post processed. New message count: ${this.messages.length}`);
    }

    // --- Main Fetch Handler (Durable Object's Entrypoint) ---
    async fetch(request) {
        const url = new URL(request.url);

        if (url.pathname.endsWith('/api/reset-room')) {
            const secret = url.searchParams.get('secret');
            if (this.env.ADMIN_SECRET && secret === this.env.ADMIN_SECRET) {
                console.log(`!!!!!!!!!! RECEIVED RESET REQUEST FOR DO !!!!!!!!!!`);
                // 【重大修改】通过 this.ctx.storage 访问存储
                await this.ctx.storage.deleteAll();
                this.messages = [];
                this.userStats = new Map();
                console.log(`!!!!!!!!!! DO STORAGE AND STATE RESET SUCCESSFULLY !!!!!!!!!!`);
                return new Response("Room has been reset successfully.", { status: 200 });
            } else {
                console.warn("Unauthorized reset attempt detected.");
                return new Response("Forbidden: Invalid or missing secret.", { status: 403 });
            }
        }

        await this.loadState();

        if (url.pathname.endsWith('/api/messages/history')) {
            const since = parseInt(url.searchParams.get('since') || '0', 10);
            const history = this.fetchHistory(since);
            return new Response(JSON.stringify(history), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }
        
        if (request.headers.get("Upgrade") === "websocket") {
            const username = url.searchParams.get("username") || "Anonymous";
            const { 0: client, 1: server } = new WebSocketPair();
            // 【重大修改】通过 this.ctx.request.headers.get(...) 访问头部
            // 和 this.ctx.acceptWebSocket(server, ...)
            this.ctx.acceptWebSocket(server, [username]);
            return new Response(null, { status: 101, webSocket: client });
        }

        if (request.method === 'GET') {
            console.log(`DO: Requesting HTML for path: ${url.pathname}`);
            return new Response(null, { 
                status: 200, 
                headers: { 'X-DO-Request-HTML': 'true' } 
            });
        }

        return new Response("Not Found", { status: 404 });
    }
    
    // --- WebSocket Event Handlers ---
    // 【重大修改】WebSocket 事件处理器现在是类的方法，而不是在 fetch 中定义
    async webSocketOpen(ws) {
        await this.loadState();
        const username = ws.getTags()[0];
        console.log(`DO: WebSocket opened for: ${username}`);
    }

    async webSocketMessage(ws, message) {
        await this.loadState();
        const username = ws.getTags()[0];
        const user = { ws, username };
        try {
            const data = JSON.parse(message);
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
                    console.warn(`DO: Unknown message type received: ${data.type}`);
            }
        } catch (err) {
            console.error('DO: Failed to handle message:', err);
            this.sendMessage(ws, { type: MSG_TYPE_ERROR, payload: { message: '消息处理失败' } });
        }
    }

    async webSocketClose(ws, code, reason, wasClean) {
        console.log(`DO: WebSocket closed. Code: ${code}, Reason: "${reason}", Clean: ${wasClean}`);
    }
    
    async webSocketError(ws, error) {
        console.error(`DO: WebSocket error:`, error);
    }
    // --- Core Logic & Handlers ---

    /**
     * 处理用户发送的聊天消息。
     * 修复：改进消息处理流程，确保状态一致性
     */
    async handleChatMessage(user, payload) {
        try {
            console.log(`💬 Handling chat message from ${user.username}. Current messages: ${this.messages.length}`);
            
            let message;
            // 根据 payload.type 明确判断，并为文本消息设置默认 type
            const messageType = payload.type || 'text'; 

            if (messageType === 'image') {
                message = await this.createImageMessage(user, payload);
            } else if (messageType === 'audio') {
                message = await this.createAudioMessage(user, payload);
            } else {
                message = this.createTextMessage(user, payload);
            }

            // 🔴 修复：使用更安全的方式添加消息
            this.messages = [...this.messages, message];
            
            if (this.messages.length > 200) {
                this.messages = this.messages.slice(-200);
            }

            this.updateUserStatsOnMessage(user.username);
            
            // 🔴 修复：先保存状态再广播
            await this.saveState();
            this.broadcast({ type: MSG_TYPE_CHAT, payload: message });
            
            console.log(`✅ Chat message processed. Message ID: ${message.id}, New messages count: ${this.messages.length}`);
        } catch (error) {
            console.error('❌ Error handling chat message:', error);
            this.sendMessage(user.ws, { type: MSG_TYPE_ERROR, payload: { message: `消息发送失败: ${error.message}` } });
        }
    }

    async handleDeleteMessage(payload) {
        const initialLength = this.messages.length;
        this.messages = this.messages.filter(m => m.id !== payload.id);
        if (this.messages.length < initialLength) {
            console.log(`🗑️  Message deleted. Messages count: ${initialLength} -> ${this.messages.length}`);
            await this.saveState();
            this.broadcast({ type: MSG_TYPE_DELETE, payload });
        }
    }

    async handleRename(user, payload) {
        // 重命名逻辑（如果需要的话）
        console.log(`🏷️  User ${user.username} requested rename to ${payload.newName}`);
        // 这里可以添加重命名的具体实现
    }

    // --- Helper Methods ---

    fetchHistory(since = 0) {
        const history = since > 0 ? this.messages.filter(msg => msg.timestamp > since) : this.messages;
        return history;
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
                httpMetadata: { contentType: mimeType || (type === 'image' ? 'image/jpeg' : 'application/octet-stream'), cacheControl: 'public, max-age=31536000' },
            });
            return `https://pub-8dfbdda6df204465aae771b4c080140b.r2.dev/${key}`;
        } catch (error) {
            console.error(`❌ R2 ${type} upload failed:`, error);
            throw new Error(`${type} 上传失败`);
        }
    }
    
    forwardRtcSignal(type, fromUser, payload) {
        const targetWs = this.state.getWebSockets(payload.target)[0];
        if (targetWs) {
            this.sendMessage(targetWs, { type, payload: { from: fromUser.username, ...payload } });
        }
    }

    sendMessage(ws, message) {
        try { ws.send(JSON.stringify(message)); }
        catch (e) { console.error("❌ Failed to send message to a WebSocket:", e); }
    }
    // 【重大修改】broadcast 方法需要从 this.ctx 获取 sockets
    broadcast(message) {
        this.ctx.getWebSockets().forEach(ws => this.sendMessage(ws, message));
    }
}