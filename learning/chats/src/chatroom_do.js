// src/chatroom_do.js (Final and Complete Version)

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
        this.messages = null;
        // CHANGED: 明确 userStats 的结构，以支持在线时长统计
        this.userStats = null; // Map<username, { messageCount, totalOnlineDuration, onlineSessions, currentSessionStart }>

        this.initializePromise = this.loadState();
    }

    // 从持久化存储中加载所有状态
    async loadState() {
        const data = await this.state.storage.get(["messages", "userStats"]);
        this.messages = data.get("messages") || [];
        this.userStats = data.get("userStats") || new Map();
    }

    // 安排一次节流的保存操作
    async scheduleSave() {
        // 只有在当前没有 alarm 时才设置，更高效
        if ((await this.state.storage.getAlarm()) === null) {
            await this.state.storage.setAlarm(Date.now() + 10000); // 10秒后保存
        }
    }

    // Alarm 触发时，将所有状态写入存储
    async alarm() {
        console.log('Alarm triggered: Saving state.');
        await this.state.storage.put({
            "messages": this.messages,
            "userStats": this.userStats
        });
        console.log('Chat state saved to storage.');
    }

    // Durable Object 的主入口点
    async fetch(request) {
        await this.initializePromise;
        const url = new URL(request.url);

        // FIXED: 恢复并增强 /user-stats 接口，以正确计算在线时长
        if (url.pathname === '/user-stats') {
            const onlineUsersMap = new Map();
            for (const ws of this.state.getWebSockets()) {
                const username = this.state.getTags(ws)[0];
                onlineUsersMap.set(username, true);
            }

            const statsArray = Array.from(this.userStats.entries()).map(([username, stats]) => {
                const isOnline = onlineUsersMap.has(username);
                let totalOnlineDuration = stats.totalOnlineDuration || 0;

                // 如果用户在线，加上当前会话的持续时间
                if (isOnline && stats.currentSessionStart) {
                    totalOnlineDuration += (Date.now() - stats.currentSessionStart);
                }

                return {
                    username,
                    messageCount: stats.messageCount || 0,
                    lastSeen: stats.lastSeen || 0,
                    totalOnlineDuration, // 返回计算后的总时长
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

    // --- WebSocket Hibernation 事件处理器 ---

    // FIXED: 在 webSocketOpen 中加入完整的在线时长跟踪逻辑
    async webSocketOpen(ws) {
        const username = this.state.getTags(ws)[0];
        console.log(`WebSocket opened for: ${username}`);

        let stats = this.userStats.get(username) || { messageCount: 0, totalOnlineDuration: 0 };
        stats.lastSeen = Date.now();
        stats.onlineSessions = (stats.onlineSessions || 0) + 1;
        // 如果是该用户的第一个会话连接，记录会话开始时间
        if (stats.onlineSessions === 1) {
            stats.currentSessionStart = Date.now();
        }
        this.userStats.set(username, stats);

        this.sendMessage(ws, { type: MSG_TYPE_HISTORY, payload: this.messages });
        this.broadcastSystemState();
        await this.scheduleSave();
    }

    async webSocketMessage(ws, message) {
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

    // FIXED: 在 webSocketClose 中加入完整的在线时长累加逻辑
    async webSocketClose(ws, code, reason, wasClean) {
        const username = this.state.getTags(ws)[0];
        console.log(`WebSocket closed for: ${username}`);

        let stats = this.userStats.get(username);
        if (stats) {
            stats.lastSeen = Date.now();
            stats.onlineSessions = (stats.onlineSessions || 1) - 1;
            // 如果是该用户的最后一个会话断开，计算并累加本次在线时长
            if (stats.onlineSessions === 0 && stats.currentSessionStart) {
                stats.totalOnlineDuration += (Date.now() - stats.currentSessionStart);
                delete stats.currentSessionStart; // 清理会话开始时间戳
            }
            this.userStats.set(username, stats);
        }

        this.broadcastSystemState();
        await this.scheduleSave();
    }

    async webSocketError(ws, error) {
        const username = this.state.getTags(ws)[0];
        console.error(`WebSocket error for user ${username}:`, error);
        // The webSocketClose handler will be called automatically after an error.
    }

    // --- 核心业务逻辑 ---

    // #region 消息处理 (您的优秀重构)
    async handleChatMessage(user, payload) {
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
            await this.scheduleSave();
        } catch (error) {
            console.error('处理聊天消息失败:', error);
            this.sendMessage(user.ws, { type: 'error', payload: { message: `消息发送失败: ${error.message}` } });
        }
    }
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
    // #endregion

    async handleDeleteMessage(payload) {
        this.messages = this.messages.filter(m => m.id !== payload.id);
        this.broadcast({ type: MSG_TYPE_DELETE, payload: payload });
        await this.scheduleSave();
    }

    // FIXED: 修复重命名逻辑以支持多标签页
    async handleRename(user, payload) {
        const oldUsername = user.username;
        const newUsername = payload.newUsername;
        if (oldUsername === newUsername) return;

        // 找到所有使用旧用户名的连接，并全部更新它们的 tag
        const socketsToUpdate = this.state.getWebSockets(oldUsername);
        for (const sock of socketsToUpdate) {
            this.state.setTags(sock, [newUsername]);
        }

        // 转移统计数据
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
        await this.scheduleSave();
    }
    
    // --- 辅助方法 ---
    
    getWsByUsername(username) {
        const wss = this.state.getWebSockets(username);
        return wss.length > 0 ? wss[0] : null;
    }

    handleOffer(fromUser, payload) {
        const targetWs = this.getWsByUsername(payload.target);
        if (!targetWs) return console.warn(`用户 ${payload.target} 不在线，无法转发 offer`);
        this.sendMessage(targetWs, { type: MSG_TYPE_OFFER, payload: { from: fromUser.username, sdp: payload.sdp } });
    }

    handleAnswer(fromUser, payload) {
        const targetWs = this.getWsByUsername(payload.target);
        if (!targetWs) return console.warn(`用户 ${payload.target} 不在线，无法转发 answer`);
        this.sendMessage(targetWs, { type: MSG_TYPE_ANSWER, payload: { from: fromUser.username, sdp: payload.sdp } });
    }

    handleCandidate(fromUser, payload) {
        const targetWs = this.getWsByUsername(payload.target);
        if (!targetWs) return console.warn(`用户 ${payload.target} 不在线，无法转发 candidate`);
        this.sendMessage(targetWs, { type: MSG_TYPE_CANDIDATE, payload: { from: fromUser.username, candidate: payload.candidate } });
    }

    handleCallEnd(fromUser, payload) {
        const targetWs = this.getWsByUsername(payload.target);
        if (!targetWs) return console.warn(`用户 ${payload.target} 不在线，无法转发 call_end`);
        this.sendMessage(targetWs, { type: MSG_TYPE_CALL_END, payload: { from: fromUser.username } });
    }

    async uploadImageToR2(imageData, filename) {
        try {
            const base64Data = imageData.split(',')[1];
            if (!base64Data) throw new Error('无效的图片数据');
            const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            const fileExtension = filename.split('.').pop() || 'jpg';
            const key = `chat-images/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
            await this.env.R2_BUCKET.put(key, imageBuffer, {
                httpMetadata: { contentType: this.getContentType(fileExtension), cacheControl: 'public, max-age=31536000' },
            });
            return `https://pub-8dfbdda6df204465aae771b4c080140b.r2.dev/${key}`;
        } catch (error) {
            console.error('R2 上传失败:', error);
            throw new Error(`图片上传失败: ${error.message}`);
        }
    }

    getContentType(extension) {
        const contentTypes = { 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif', 'webp': 'image/webp' };
        return contentTypes[extension.toLowerCase()] || 'image/jpeg';
    }

    async uploadAudioToR2(audioData, filename, mimeType) {
        try {
            const base64Data = audioData.split(',')[1];
            if (!base64Data) throw new Error('无效的音频数据');
            const audioBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            const fileExtension = filename.split('.').pop() || 'bin';
            const key = `chat-audio/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
            await this.env.R2_BUCKET.put(key, audioBuffer, {
                httpMetadata: { contentType: mimeType || 'application/octet-stream', cacheControl: 'public, max-age=31536000' },
            });
            return `https://pub-8dfbdda6df204465aae771b4c080140b.r2.dev/${key}`;
        } catch (error) {
            console.error('R2 音频上传失败:', error);
            throw new Error(`音频上传失败: ${error.message}`);
        }
    }

    sendMessage(ws, message) {
        try {
            ws.send(JSON.stringify(message));
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    }

    broadcast(message) {
        for (const ws of this.state.getWebSockets()) {
            this.sendMessage(ws, message);
        }
    }

    // FIXED: 确保广播用户列表时去重
    broadcastSystemState() {
        const userList = Array.from(new Set(this.state.getWebSockets().map(ws => this.state.getTags(ws)[0])));
        this.broadcast({
            type: MSG_TYPE_SYSTEM_STATE,
            payload: { users: userList }
        });
    }
}