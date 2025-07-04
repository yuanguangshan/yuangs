// src/chatroom_do.js (Corrected and Final Version)

// 定义应用层协议的消息类型
const MSG_TYPE_CHAT = 'chat';
const MSG_TYPE_DELETE = 'delete';
const MSG_TYPE_RENAME = 'rename';
const MSG_TYPE_SYSTEM_STATE = 'system_state';
const MSG_TYPE_HISTORY = 'history';
const MSG_TYPE_OFFER = 'offer';
const MSG_TYPE_ANSWER = 'answer';
const MSG_TYPE_CANDIDATE = 'candidate';
const MSG_TYPE_CALL_END = 'call_end';

export class HibernatingChatRoom {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        // 在实例首次创建时，将内存状态初始化为 null。
        // 这是 `loadState` 函数判断是否需要从持久化存储加载数据的关键。
        this.messages = null;
        this.userStats = null;
    }

    /**
     * 从持久化存储加载状态到内存中。
     * 这个函数是幂等的：在 Durable Object 实例的生命周期内，它只会真正执行一次加载操作。
     * 后续的调用会因为 this.messages 不再是 null 而直接返回。
     */
    async loadState() {
        if (this.messages === null) {
            console.log("State not in memory. Loading from storage...");
            const data = await this.state.storage.get(["messages", "userStats"]);
            this.messages = data.get("messages") || [];
            this.userStats = data.get("userStats") || new Map();
            console.log(`State loaded. Messages: ${this.messages.length}, Users: ${this.userStats.size}`);
        }
    }
    
    /**
     * 将当前内存中的状态写入持久化存储。
     * 这是一个“直写（write-through）”策略，确保每次状态变更都持久化，防止数据丢失。
     */
    async saveState() {
        // 确保在保存前，状态已经被加载到内存中，避免用 null 覆盖已有数据。
        if (this.messages === null) {
            console.warn("Attempted to save state before loading. Aborting save.");
            return;
        }
        console.log("Saving state to storage...");
        try {
            await this.state.storage.put({
                "messages": this.messages,
                "userStats": this.userStats
            });
            console.log("State saved successfully.");
        } catch(e) {
            console.error("Failed to save state:", e);
        }
    }


    // Main fetch handler - 这是所有外部请求（包括WebSocket升级）的入口
    async fetch(request) {
        // **核心修复**: 在处理任何请求之前，首先确保状态已从存储中加载。
        // 这保证了即使DO刚刚从休眠中唤醒，它也能拥有正确的历史数据。
        await this.loadState();

        const url = new URL(request.url);

        if (url.pathname === '/user-stats') {
            const onlineUsersMap = new Map();
            for (const ws of this.state.getWebSockets()) {
                const username = this.state.getTags(ws)[0];
                onlineUsersMap.set(username, true);
            }

            const statsArray = Array.from(this.userStats.entries()).map(([username, stats]) => {
                const isOnline = onlineUsersMap.has(username);
                let totalOnlineDuration = stats.totalOnlineDuration || 0;

                if (isOnline && stats.currentSessionStart) {
                    totalOnlineDuration += (Date.now() - stats.currentSessionStart);
                }

                return {
                    username,
                    messageCount: stats.messageCount || 0,
                    lastSeen: stats.lastSeen || 0,
                    totalOnlineDuration,
                    isOnline,
                };
            });
            return new Response(JSON.stringify(statsArray), { headers: { 'Content-Type': 'application/json' } });
        }

        const upgradeHeader = request.headers.get("Upgrade");
        if (upgradeHeader !== "websocket") {
            return new Response("Expected Upgrade: websocket", { status: 426 });
        }

        const username = url.searchParams.get("username") || "Anonymous";
        const { 0: client, 1: server } = new WebSocketPair();
        this.state.acceptWebSocket(server, [username]);

        return new Response(null, { status: 101, webSocket: client });
    }

    // --- WebSocket Handlers ---

    async webSocketOpen(ws) {
        // 再次调用 loadState 作为安全保障，但由于 fetch 中已加载，这里会直接跳过。
        await this.loadState();
        const username = this.state.getTags(ws)[0];
        console.log(`WebSocket opened for: ${username}`);
        
        let stats = this.userStats.get(username) || { messageCount: 0, totalOnlineDuration: 0 };
        stats.lastSeen = Date.now();
        stats.onlineSessions = (stats.onlineSessions || 0) + 1;
        if (stats.onlineSessions === 1) {
            stats.currentSessionStart = Date.now();
        }
        this.userStats.set(username, stats);
        
        // **关键点**: 此时 this.messages 已经包含了从持久化存储中恢复的历史消息。
        this.sendMessage(ws, { type: MSG_TYPE_HISTORY, payload: this.messages });
        
        this.broadcastSystemState();
        
        await this.saveState();
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
                // WebRTC 信号转发逻辑保持不变
                case MSG_TYPE_OFFER: this.handleOffer(user, data.payload); break;
                case MSG_TYPE_ANSWER: this.handleAnswer(user, data.payload); break;
                case MSG_TYPE_CANDIDATE: this.handleCandidate(user, data.payload); break;
                case MSG_TYPE_CALL_END: this.handleCallEnd(user, data.payload); break;
                default: console.warn('Unknown message type:', data.type);
            }
        } catch (err) {
            console.error('Failed to handle message:', err);
            this.sendMessage(ws, { type: 'error', payload: { message: '消息处理失败' } });
        }
    }
    
    async webSocketClose(ws, code, reason, wasClean) {
        await this.loadState();
        const username = this.state.getTags(ws)[0];
        console.log(`WebSocket closed for: ${username}`);
        
        let stats = this.userStats.get(username);
        if (stats) {
            stats.lastSeen = Date.now();
            stats.onlineSessions = (stats.onlineSessions || 1) - 1;
            if (stats.onlineSessions === 0 && stats.currentSessionStart) {
                stats.totalOnlineDuration += (Date.now() - stats.currentSessionStart);
                delete stats.currentSessionStart;
            }
            this.userStats.set(username, stats);
        }
        
        this.broadcastSystemState();
        await this.saveState();
    }
    
    async webSocketError(ws, error) {
        // loadState 不是必须的，因为 webSocketClose 会被调用
        const username = this.state.getTags(ws)[0];
        console.error(`WebSocket error for user ${username}:`, error);
    }

    // --- Core Logic (所有核心逻辑函数也需要先加载状态) ---

    async handleChatMessage(user, payload) {
        await this.loadState();
        try {
            let message;
            if (payload.type === 'image') {
                message = await this.#processImageMessage(user, payload);
            } else if (payload.type === 'audio') {
                message = await this.#processAudioMessage(user, payload);
            } else {
                message = this.#processTextMessage(user, payload);
            }
            this.messages.push(message);
            if (this.messages.length > 100) this.messages.shift();

            let stats = this.userStats.get(user.username);
            if (stats) {
                stats.messageCount = (stats.messageCount || 0) + 1;
                this.userStats.set(user.username, stats);
            }
            this.broadcast({ type: MSG_TYPE_CHAT, payload: message });
            await this.saveState(); 
        } catch (error) {
            console.error('处理聊天消息失败:', error);
            this.sendMessage(user.ws, { type: 'error', payload: { message: `消息发送失败: ${error.message}` } });
        }
    }

    // ... (所有 #process... 和 handle... 方法保持不变，因为它们都被 `await this.loadState()` 保护了) ...

    #processTextMessage(user, payload) {
        return {
            id: crypto.randomUUID(),
            username: user.username,
            timestamp: Date.now(),
            text: payload.text,
        };
    }
    async #processImageMessage(user, payload) {
        const imageUrl = await this.uploadImageToR2(payload.image, payload.filename);
        return {
            id: crypto.randomUUID(),
            username: user.username,
            timestamp: Date.now(),
            type: 'image',
            imageUrl,
            filename: payload.filename,
            size: payload.size,
            caption: payload.caption || ''
        };
    }
    async #processAudioMessage(user, payload) {
        const audioUrl = await this.uploadAudioToR2(payload.audio, payload.filename, payload.mimeType);
        return {
            id: crypto.randomUUID(),
            username: user.username,
            timestamp: Date.now(),
            type: 'audio',
            audioUrl,
            filename: payload.filename,
            size: payload.size,
        };
    }

    async handleDeleteMessage(payload) {
        await this.loadState();
        this.messages = this.messages.filter(m => m.id !== payload.id);
        this.broadcast({ type: MSG_TYPE_DELETE, payload: payload });
        await this.saveState();
    }

    async handleRename(user, payload) {
        await this.loadState();
        const oldUsername = user.username;
        const newUsername = payload.newUsername;
        if (oldUsername === newUsername) return;

        const socketsToUpdate = this.state.getWebSockets(oldUsername);
        for (const sock of socketsToUpdate) {
            this.state.setTags(sock, [newUsername]);
        }

        if (this.userStats.has(oldUsername)) {
            const stats = this.userStats.get(oldUsername);
            const existingNewStats = this.userStats.get(newUsername) || { messageCount: 0, totalOnlineDuration: 0 };
            existingNewStats.messageCount += stats.messageCount || 0;
            existingNewStats.totalOnlineDuration += stats.totalOnlineDuration || 0;
            if (stats.onlineSessions > 0) {
                existingNewStats.onlineSessions = (existingNewStats.onlineSessions || 0) + stats.onlineSessions;
                existingNewStats.currentSessionStart = stats.currentSessionStart;
            }
            this.userStats.set(newUsername, existingNewStats);
            this.userStats.delete(oldUsername);
        }

        this.messages.forEach(msg => {
            if (msg.username === oldUsername) msg.username = newUsername;
        });

        this.broadcastSystemState();
        this.broadcast({ type: MSG_TYPE_HISTORY, payload: this.messages });
        await this.saveState();
    }
    
    // --- 辅助方法 (所有辅助方法保持不变) ---
    getWsByUsername(username) {
        const wss = this.state.getWebSockets(username);
        return wss.length > 0 ? wss[0] : null;
    }
    handleOffer(fromUser, payload) { /* ... */ }
    handleAnswer(fromUser, payload) { /* ... */ }
    handleCandidate(fromUser, payload) { /* ... */ }
    handleCallEnd(fromUser, payload) { /* ... */ }
    async uploadImageToR2(imageData, filename) { /* ... */ }
    getContentType(extension) { /* ... */ }
    async uploadAudioToR2(audioData, filename, mimeType) { /* ... */ }
    sendMessage(ws, message) { /* ... */ }
    broadcast(message) { /* ... */ }
    broadcastSystemState() { /* ... */ }
}