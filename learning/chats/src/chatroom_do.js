// src/chatroom_do.js (Fixed Version)

/**
 * HibernatingChatRoom 是一个Durable Object，它负责管理单个聊天室的所有状态和逻辑，包括：
 * - 消息的存储与广播
 * - 用户统计信息的记录
 * - WebSocket连接的处理
 * - 响应来自主Worker的特定API请求（如获取历史）和内部命令（如定时发帖）
 */

// 定义消息类型常量，便于维护和识别
const MSG_TYPE_CHAT = 'chat';
const MSG_TYPE_DELETE = 'delete';
const MSG_TYPE_ERROR = 'error';
const MSG_TYPE_RENAME = 'rename';
// WebRTC信令类型也在此定义，尽管处理逻辑在下方
const MSG_TYPE_OFFER = 'offer';
const MSG_TYPE_ANSWER = 'answer';
const MSG_TYPE_CANDIDATE = 'candidate';
const MSG_TYPE_CALL_END = 'call_end';

export class HibernatingChatRoom {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.messages = null;   // 消息数组，将从持久化存储中懒加载
        this.userStats = null;  // 用户统计Map，将从持久化存储中懒加载
    }

    // --- State Management ---

    /**
     * 从持久化存储加载状态到内存。
     * 这个函数是幂等的，在一个Durable Object实例的生命周期中只会执行一次加载。
     */
    async loadState() {
        if (this.messages !== null) return; // 如果已加载，则直接返回

        console.log("DO State: Not in memory. Loading from storage...");
        const data = await this.state.storage.get(["messages", "userStats"]) || {};
        this.messages = data.messages || [];
        // 确保从存储中读取的数据能被正确转换为Map对象
        this.userStats = new Map(Object.entries(data.userStats || {}));
        console.log(`DO State: Loaded. Messages: ${this.messages.length}, Users: ${this.userStats.size}`);
    }

    /**
     * 将当前内存中的状态写入持久化存储。
     */
    async saveState() {
        if (this.messages === null || this.userStats === null) return; // 防止在未加载状态时保存
        // 将Map转换为普通对象以便进行JSON序列化和存储
        const serializableUserStats = Object.fromEntries(this.userStats);
        await this.state.storage.put({
            messages: this.messages,
            userStats: serializableUserStats,
        });
    }

    /**
     * 处理由主Worker转发来的所有请求。
     */
    async fetch(request) {
        const url = new URL(request.url);

        // ================================================================
        //           API：通过密钥安全地重置房间状态
        // ================================================================
        if (url.pathname.endsWith('/api/reset-room')) {
            const secret = url.searchParams.get('secret');

            if (this.env.ADMIN_SECRET && secret === this.env.ADMIN_SECRET) {
                console.log(`!!!!!!!!!! RECEIVED RESET REQUEST FOR DO !!!!!!!!!!`);
                await this.state.storage.deleteAll();
                this.messages = [];
                this.userStats = new Map();
                console.log(`!!!!!!!!!! DO STORAGE AND STATE RESET SUCCESSFULLY !!!!!!!!!!`);
                return new Response("Room has been reset successfully.", { status: 200 });
            } else {
                console.warn("Unauthorized reset attempt detected.");
                return new Response("Forbidden: Invalid or missing secret.", { status: 403 });
            }
        }
        // ================================================================

        // 对于所有其他请求，先加载状态
        await this.loadState(); 

        // API：处理内部定时发帖
        if (url.pathname.endsWith('/internal/auto-post') && request.method === 'POST') {
            try {
                const { text, secret } = await request.json();
                if (this.env.CRON_SECRET && secret !== this.env.CRON_SECRET) {
                    return new Response("Unauthorized", { status: 403 });
                }
                if (!text) {
                    return new Response("Missing text", { status: 400 });
                }
                const message = this.createTextMessage({ username: "小助手" }, { text });
                this.messages.push(message);
                if (this.messages.length > 200) this.messages.shift();
                this.broadcast({ type: 'chat', payload: message });
                await this.saveState();
                return new Response("Auto-post successful", { status: 200 });
            } catch (error) {
                console.error("Failed to process auto-post:", error);
                return new Response("Internal error", { status: 500 });
            }
        }
        
        // API：处理公开的历史消息
        if (url.pathname.endsWith('/api/messages/history')) {
            const since = parseInt(url.searchParams.get('since') || '0', 10);
            const history = this.fetchHistory(since);
            return new Response(JSON.stringify(history), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }
        
        // WebSocket 升级请求
        if (request.headers.get("Upgrade") === "websocket") {
            const username = url.searchParams.get("username") || "Anonymous";
            const { 0: client, 1: server } = new WebSocketPair();
            this.state.acceptWebSocket(server, [username]);
            return new Response(null, { status: 101, webSocket: client });
        }

        // 页面加载请求：告诉主Worker返回HTML
        if (request.method === 'GET') {
            console.log(`DO: Requesting HTML for path: ${url.pathname}`);
            return new Response(null, { 
                status: 200, 
                headers: { 'X-DO-Request-HTML': 'true' } 
            });
        }

        // 其他情况返回404
        return new Response("Not Found", { status: 404 });
    }
    
    // --- WebSocket Event Handlers ---

    async webSocketOpen(ws) {
        await this.loadState();
        const username = this.state.getTags(ws)[0];
        console.log(`DO: WebSocket opened for: ${username}`);
    }

    async webSocketMessage(ws, message) {
        await this.loadState();
        const username = this.state.getTags(ws)[0];
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
        console.log(`DO: WebSocket closed. Code: ${code}, Reason: ${reason}, Clean: ${wasClean}`);
    }
    
    async webSocketError(ws, error) {
        console.error(`DO: WebSocket error:`, error);
    }

    // --- Core Logic & Handlers ---

    /**
     * 处理用户发送的聊天消息。
     */// src/chatroom_do.js

    /**
     * 处理用户发送的聊天消息。
     */
    async handleChatMessage(user, payload) {
        try {
            let message;
            // 【修改】根据 payload.type 明确判断，并为文本消息设置默认 type
            const messageType = payload.type || 'text'; 

            if (messageType === 'image') {
                message = await this.createImageMessage(user, payload);
            } else if (messageType === 'audio') {
                message = await this.createAudioMessage(user, payload);
            } else {
                // 现在 payload 中可能没有 type，但我们已经推断出是 'text'
                message = this.createTextMessage(user, payload);
            }

            this.messages.push(message);
            if (this.messages.length > 200) this.messages.shift();

            this.updateUserStatsOnMessage(user.username);
            this.broadcast({ type: MSG_TYPE_CHAT, payload: message });
            await this.saveState();
        } catch (error) {
            console.error('DO: Error handling chat message:', error);
            this.sendMessage(user.ws, { type: MSG_TYPE_ERROR, payload: { message: `消息发送失败: ${error.message}` } });
        }
    }

    async handleDeleteMessage(payload) {
        const initialLength = this.messages.length;
        this.messages = this.messages.filter(m => m.id !== payload.id);
        if (this.messages.length < initialLength) {
            this.broadcast({ type: MSG_TYPE_DELETE, payload });
            await this.saveState();
        }
    }

    async handleRename(user, payload) {
        // 重命名逻辑（如果需要的话）
        console.log(`User ${user.username} requested rename to ${payload.newName}`);
        // 这里可以添加重命名的具体实现
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
// src/chatroom_do.js

    createTextMessage(user, payload) {
        // 【重大修正】为所有文本消息添加 type: 'text' 属性
        return { 
            id: crypto.randomUUID(), 
            username: user.username, 
            timestamp: Date.now(), 
            text: payload.text,
            type: 'text' // <<<<<<<<<<< 新增此行，确保数据结构一致
        };
    }

async createImageMessage(user, payload) {
        // 【重大修正】不再使用 ...payload，只选取必要的字段
        const imageUrl = await this.uploadToR2(payload.image, payload.filename, 'image');
        return { 
            id: crypto.randomUUID(), 
            username: user.username, 
            timestamp: Date.now(), 
            type: 'image', 
            imageUrl: imageUrl, // << 已上传到R2的URL
            // 只保留有用的元数据，丢弃巨大的base64数据
            filename: payload.filename,
            size: payload.size,
            caption: payload.caption 
        };
    }

async createAudioMessage(user, payload) {
        // 【重大修正】同样，不再使用 ...payload
        const audioUrl = await this.uploadToR2(payload.audio, payload.filename, 'audio', payload.mimeType);
        return { 
            id: crypto.randomUUID(), 
            username: user.username, 
            timestamp: Date.now(), 
            type: 'audio', 
            audioUrl: audioUrl, // << 已上传到R2的URL
            // 只保留有用的元数据
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
            console.error(`DO: R2 ${type} upload failed:`, error);
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
        catch (e) { console.error("DO: Failed to send message to a WebSocket:", e); }
    }

    broadcast(message) {
        this.state.getWebSockets().forEach(ws => this.sendMessage(ws, message));
    }
}