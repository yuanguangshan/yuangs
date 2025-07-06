// src/chatroom_do.js (修复版本 - 解决消息丢失问题)

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
        this.isStateLoaded = false; // 添加状态加载标志
        this.isLoading = false; // 添加加载中标志，防止并发加载
        this.stateLock = null; // 状态锁，确保状态操作的原子性
    }

    // --- State Management ---

    /**
     * 从持久化存储加载状态到内存。
     * 这个函数是幂等的，在一个Durable Object实例的生命周期中只会执行一次加载。
     * 修复：添加并发控制，防止重复加载
     */
    async loadState() {
        if (this.isStateLoaded) return;
        
        // 防止并发加载
        if (this.isLoading) {
            // 等待其他加载完成
            while (this.isLoading) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            return;
        }
        
        this.isLoading = true;
        
        try {
            console.log("DO State: Not in memory. Loading from storage...");
            const data = await this.state.storage.get(["messages", "userStats"]) || {};
            this.messages = data.messages || [];
            // 确保从存储中读取的数据能被正确转换为Map对象
            this.userStats = new Map(Object.entries(data.userStats || {}));
            this.isStateLoaded = true;
            console.log(`DO State: Loaded. Messages: ${this.messages.length}, Users: ${this.userStats.size}`);
        } catch (error) {
            console.error("❌ Failed to load state:", error);
            // 即使加载失败，也要初始化基本状态
            this.messages = [];
            this.userStats = new Map();
            this.isStateLoaded = true;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * 将当前内存中的状态写入持久化存储。
     * 修复：添加状态锁，确保保存操作的原子性
     */
    async saveState() {
        if (!this.isStateLoaded) {
            console.warn("DO State: Attempted to save state before loading. Skipping save.");
            return;
        }

        // 防止并发保存
        if (this.stateLock) {
            await this.stateLock;
        }

        this.stateLock = this._performSave();
        await this.stateLock;
        this.stateLock = null;
    }

    /**
     * 执行实际的状态保存操作
     */
    async _performSave() {
        try {
            // 将Map转换为普通对象以便进行JSON序列化和存储
            const serializableUserStats = Object.fromEntries(this.userStats);
            
            // 创建状态快照，避免在保存过程中状态被修改
            const stateSnapshot = {
                messages: [...this.messages],
                userStats: serializableUserStats,
            };

            await this.state.storage.put(stateSnapshot);
            console.log(`DO State: Saved. Messages: ${this.messages.length}, Users: ${this.userStats.size}`);
        } catch (error) {
            console.error("❌ Failed to save state:", error);
            throw error;
        }
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
            const requestInfo = {
                method: request.method,
                headers: Object.fromEntries(request.headers),
                url: request.url,
                timestamp: new Date().toISOString()
            };

            // 🔴 添加详细的日志记录，追踪重置请求的来源
            console.log(`🚨 RESET REQUEST RECEIVED:`, JSON.stringify(requestInfo, null, 2));

            if (this.env.ADMIN_SECRET && secret === this.env.ADMIN_SECRET) {
                console.log(`⚠️  CONFIRMED: Authorized reset request. Proceeding with reset...`);
                
                // 记录重置前的状态
                await this.loadState();
                console.log(`📊 Pre-reset state: Messages: ${this.messages.length}, Users: ${this.userStats.size}`);
                
                await this.state.storage.deleteAll();
                this.messages = [];
                this.userStats = new Map();
                this.isStateLoaded = true;
                
                console.log(`✅ DO STORAGE AND STATE RESET SUCCESSFULLY`);
                return new Response("Room has been reset successfully.", { status: 200 });
            } else {
                console.warn(`🚫 UNAUTHORIZED reset attempt detected:`, requestInfo);
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
                
                console.log(`📝 Auto-post request received. Current messages count: ${this.messages.length}`);
                
                if (this.env.CRON_SECRET && secret !== this.env.CRON_SECRET) {
                    console.warn("🚫 Unauthorized auto-post attempt");
                    return new Response("Unauthorized", { status: 403 });
                }
                if (!text) {
                    return new Response("Missing text", { status: 400 });
                }
                
                // 🔴 修复：确保状态已加载并创建消息
                await this.loadState();
                
                const message = this.createTextMessage({ username: "小助手" }, { text });
                
                // 🔴 修复：使用更安全的方式添加消息
                this.messages = [...this.messages, message];
                
                // 限制消息数量
                if (this.messages.length > 200) {
                    this.messages = this.messages.slice(-200);
                }
                
                console.log(`📤 Auto-post created. Message ID: ${message.id}, New messages count: ${this.messages.length}`);
                
                // 🔴 修复：先保存状态再广播，确保持久化成功
                await this.saveState();
                
                // 广播消息
                this.broadcast({ type: 'chat', payload: message });
                
                console.log(`✅ Auto-post processed successfully. Total messages: ${this.messages.length}`);
                
                return new Response(JSON.stringify({ 
                    success: true, 
                    messageId: message.id,
                    totalMessages: this.messages.length 
                }), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                console.error("❌ Failed to process auto-post:", error);
                return new Response(`Internal error: ${error.message}`, { status: 500 });
            }
        }
        
        // API：处理公开的历史消息
        if (url.pathname.endsWith('/api/messages/history')) {
            try {
                const since = parseInt(url.searchParams.get('since') || '0', 10);
                const history = this.fetchHistory(since);
                console.log(`📜 History request: returning ${history.length} messages (since: ${since})`);
                console.log(`📜 Sample messages:`, history.slice(0, 3).map(m => ({ id: m.id, username: m.username, text: m.text?.substring(0, 50) })));
                
                return new Response(JSON.stringify(history), {
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Access-Control-Allow-Origin': '*' 
                    }
                });
            } catch (error) {
                console.error("❌ Failed to fetch history:", error);
                return new Response(`Error fetching history: ${error.message}`, { status: 500 });
            }
        }
        
        // WebSocket 升级请求
        if (request.headers.get("Upgrade") === "websocket") {
            const username = url.searchParams.get("username") || "Anonymous";
            const { 0: client, 1: server } = new WebSocketPair();
            this.state.acceptWebSocket(server, [username]);
            console.log(`🔌 WebSocket connection established for: ${username}`);
            return new Response(null, { status: 101, webSocket: client });
        }

        // 页面加载请求：告诉主Worker返回HTML
        if (request.method === 'GET') {
            console.log(`📄 HTML request for path: ${url.pathname}`);
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
        console.log(`🔌 WebSocket opened for: ${username}. Current messages: ${this.messages.length}`);
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
                    console.warn(`⚠️  Unknown message type received: ${data.type}`);
            }
        } catch (err) {
            console.error('❌ Failed to handle message:', err);
            this.sendMessage(ws, { type: MSG_TYPE_ERROR, payload: { message: '消息处理失败' } });
        }
    }

    async webSocketClose(ws, code, reason, wasClean) {
        console.log(`🔌 WebSocket closed. Code: ${code}, Reason: ${reason}, Clean: ${wasClean}`);
    }
    
    async webSocketError(ws, error) {
        console.error(`❌ WebSocket error:`, error);
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

    broadcast(message) {
        this.state.getWebSockets().forEach(ws => this.sendMessage(ws, message));
    }
}