// 文件: src/chatroom_do.js (Final Integrated Version)

import { DurableObject } from "cloudflare:workers";

// 消息类型常量
const MSG_TYPE_CHAT = 'chat';
const MSG_TYPE_DELETE = 'delete';
const MSG_TYPE_ERROR = 'error';
const MSG_TYPE_WELCOME = 'welcome';
const MSG_TYPE_USER_JOIN = 'user_join';
const MSG_TYPE_USER_LEAVE = 'user_leave';
const MSG_TYPE_DEBUG_LOG = 'debug_log';
const MSG_TYPE_HEARTBEAT = 'heartbeat';
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
        this.sessions = new Map();
        this.debugLogs = [];
        this.maxDebugLogs = 100;
        this.isInitialized = false;
        this.heartbeatInterval = null;
        
        this.debugLog("🏗️ DO instance created.");
        
        // 启动心跳机制
        this.startHeartbeat();
    }

    // ============ 调试日志系统 ============
    debugLog(message, level = 'INFO', data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            id: crypto.randomUUID().substring(0, 8),
            data
        };
        
        // 添加到内存日志
        this.debugLogs.push(logEntry);
        if (this.debugLogs.length > this.maxDebugLogs) {
            this.debugLogs.shift();
        }
        
        // 同时输出到控制台
        if (data) {
            console.log(`[${timestamp}] [${level}] ${message}`, data);
        } else {
            console.log(`[${timestamp}] [${level}] ${message}`);
        }
        
        // 实时广播调试日志给所有连接的会话（避免循环）
        if (level !== 'HEARTBEAT') {
            this.broadcastDebugLog(logEntry);
        }
    }

    // 单独的调试日志广播方法，避免无限循环
    broadcastDebugLog(logEntry) {
        const message = JSON.stringify({
            type: MSG_TYPE_DEBUG_LOG,
            payload: logEntry
        });
        
        this.sessions.forEach((session) => {
            try {
                if (session.ws.readyState === WebSocket.OPEN) {
                    session.ws.send(message);
                }
            } catch (e) {
                // 静默处理发送失败，避免在调试日志中产生更多日志
            }
        });
    }

    // ============ 状态管理 ============
    async initialize() {
        if (this.isInitialized) return;
        
        // 加载消息历史
        this.messages = (await this.ctx.storage.get("messages")) || [];
        
        // 尝试恢复会话信息（虽然 WebSocket 连接无法恢复，但可以恢复会话元数据）
        const savedSessionsData = await this.ctx.storage.get("sessions_metadata");
        if (savedSessionsData) {
            this.debugLog(`📁 发现 ${savedSessionsData.length} 个会话元数据。`);
        }
        
        this.debugLog(`📁 已加载. Messages: ${this.messages.length}`);
        this.isInitialized = true;
    }

    async saveState() {
        if (this.messages === null) return;
        
        const sessionMetadata = Array.from(this.sessions.entries()).map(([id, session]) => ({
            id,
            username: session.username,
            joinTime: session.joinTime,
            lastSeen: session.lastSeen
        }));
        
        const savePromise = Promise.all([
            this.ctx.storage.put("messages", this.messages),
            this.ctx.storage.put("sessions_metadata", sessionMetadata)
        ]);
        
        // 使用 waitUntil 确保存储操作在实例休眠前完成
        this.ctx.waitUntil(savePromise);
        
        try {
            await savePromise;
            this.debugLog(`💾 状态已保存. Messages: ${this.messages.length}, Sessions: ${this.sessions.size}`);
        } catch (e) {
            this.debugLog(`💥 状态保存失败: ${e.message}`, 'ERROR');
        }
    }

    // ============ 心跳机制 ============
    startHeartbeat() {
        // 每30秒发送一次心跳
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, 30000);
    }

    sendHeartbeat() {
        if (this.sessions.size === 0) return;
        
        const heartbeatMessage = JSON.stringify({
            type: MSG_TYPE_HEARTBEAT,
            payload: { timestamp: Date.now() }
        });
        
        let activeSessions = 0;
        const disconnectedSessions = [];
        
        this.sessions.forEach((session, sessionId) => {
            try {
                if (session.ws.readyState === WebSocket.OPEN) {
                    session.ws.send(heartbeatMessage);
                    session.lastSeen = Date.now();
                    activeSessions++;
                } else {
                    disconnectedSessions.push(sessionId);
                }
            } catch (e) {
                disconnectedSessions.push(sessionId);
            }
        });
        
        // 清理断开的会话
        disconnectedSessions.forEach(sessionId => {
            this.cleanupSession(sessionId, { code: 1011, reason: 'Heartbeat failed', wasClean: false });
        });
        
        if (activeSessions > 0) {
            this.debugLog(`💓 发送心跳包到 ${activeSessions} 个活跃会话 `, 'HEARTBEAT');
        }
    }

    // ============ RPC 方法 ============
    async postBotMessage(payload, secret) {
        // 安全检查
        if (this.env.CRON_SECRET && secret !== this.env.CRON_SECRET) {
            this.debugLog("BOT POST: Unauthorized attempt!", 'ERROR');
            return;
        }
        
        this.debugLog(`🤖 机器人自动发帖...`, 'INFO', payload);
        await this.initialize();
        
        const message = {
            id: crypto.randomUUID(),
            username: "机器人小助手", 
            timestamp: Date.now(),
            ...payload 
        };
        
        await this.addAndBroadcastMessage(message);
    }

    /**
     * 兼容旧的 cronPost 方法
     */
    async cronPost(text, secret) {
        this.debugLog(`🤖 收到定时任务, 自动发送文本消息: ${text}`);
        // 复用机器人发帖逻辑
        await this.postBotMessage({ text, type: 'text' }, secret);
    }

    // ============ 主要入口点 ============
    async fetch(request) {
        const url = new URL(request.url);
        this.debugLog(`📥 服务端入站请求: ${request.method} ${url.pathname}`);

        // 确保状态已加载
        await this.initialize();

        // 处理 WebSocket 升级请求
        if (request.headers.get("Upgrade") === "websocket") {
            const { 0: client, 1: server } = new WebSocketPair();
            
            // 正确设置WebSocket事件处理器
            this.ctx.acceptWebSocket(server);
            
            // 处理会话
            await this.handleWebSocketSession(server, url);
            return new Response(null, { status: 101, webSocket: client });
        }
        
        // 处理所有 /api/ 请求
        if (url.pathname.startsWith('/api/')) {
            return await this.handleApiRequest(url);
        }

        // 处理所有其他 GET 请求（例如页面加载）
        if (request.method === "GET") {
            this.debugLog(`📄 发送HTML文件: ${url.pathname}`);
            return new Response(null, {
                headers: { "X-DO-Request-HTML": "true" },
            });
        }

        this.debugLog(`❓ 未处理连接🔗: ${request.method} ${url.pathname}`, 'WARN');
        return new Response("Not Found", { status: 404 });
    }

    // ============ API 请求处理 ============
    async handleApiRequest(url) {
        // API: 获取调试日志
        if (url.pathname.endsWith('/debug/logs')) {
            this.debugLog(`🔍 请求debug信息. Total logs: ${this.debugLogs.length}`);
            return new Response(JSON.stringify({
                logs: this.debugLogs,
                totalLogs: this.debugLogs.length,
                activeSessions: this.sessions.size,
                timestamp: new Date().toISOString()
            }), {
                headers: { 
                    'Content-Type': 'application/json', 
                    'Access-Control-Allow-Origin': '*' 
                }
            });
        }
        
        // API: 获取会话状态
        if (url.pathname.endsWith('/debug/sessions')) {
            const sessionInfo = Array.from(this.sessions.entries()).map(([id, session]) => ({
                id,
                username: session.username,
                joinTime: session.joinTime,
                lastSeen: session.lastSeen,
                isConnected: session.ws.readyState === WebSocket.OPEN
            }));
            
            return new Response(JSON.stringify({
                sessions: sessionInfo,
                totalSessions: this.sessions.size,
                timestamp: new Date().toISOString()
            }), {
                headers: { 
                    'Content-Type': 'application/json', 
                    'Access-Control-Allow-Origin': '*' 
                }
            });
        }
        
        // API: 清空调试日志
        if (url.pathname.endsWith('/debug/clear')) {
            const clearedCount = this.debugLogs.length;
            this.debugLogs = [];
            this.debugLog(`🧹 Debug logs cleared. Cleared ${clearedCount} logs`);
            return new Response(JSON.stringify({
                message: `Cleared ${clearedCount} debug logs`,
                timestamp: new Date().toISOString()
            }), {
                headers: { 
                    'Content-Type': 'application/json', 
                    'Access-Control-Allow-Origin': '*' 
                }
            });
        }
        
        // API: 重置房间
        if (url.pathname.endsWith('/reset-room')) {
            const secret = url.searchParams.get('secret');
            if (this.env.ADMIN_SECRET && secret === this.env.ADMIN_SECRET) {
                await this.ctx.storage.deleteAll();
                this.messages = [];
                this.sessions.clear();
                this.debugLogs = [];
                this.debugLog("🔄 Room reset successfully");
                return new Response("Room has been reset successfully.", { status: 200 });
            } else {
                this.debugLog("🚫 Unauthorized reset attempt", 'WARN');
                return new Response("Forbidden.", { status: 403 });
            }
        }
        
        // API: 获取历史消息
        if (url.pathname.endsWith('/messages/history')) {
            const since = parseInt(url.searchParams.get('since') || '0', 10);
            const history = this.fetchHistory(since);
            this.debugLog(`📜 请求历史消息. Since: ${since}, 返回: ${history.length} 条消息`);
            return new Response(JSON.stringify(history), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        // API: 删除消息
        if (url.pathname.endsWith('/messages/delete')) {
            const messageId = url.searchParams.get('id');
            const secret = url.searchParams.get('secret');
            
            if (this.env.ADMIN_SECRET && secret === this.env.ADMIN_SECRET) {
                const originalCount = this.messages.length;
                this.messages = this.messages.filter(msg => msg.id !== messageId);
                const deleted = originalCount - this.messages.length;
                
                if (deleted > 0) {
                    await this.saveState();
                    this.debugLog(`🗑️ Message deleted: ${messageId}`);
                    
                    // 广播删除消息
                    this.broadcast({ 
                        type: MSG_TYPE_DELETE, 
                        payload: { messageId } 
                    });
                    
                    return new Response(JSON.stringify({
                        message: "消息删除成功",
                        deleted: deleted
                    }), {
                        headers: { 
                            'Content-Type': 'application/json', 
                            'Access-Control-Allow-Origin': '*' 
                        }
                    });
                } else {
                    return new Response(JSON.stringify({
                        message: "Message not found"
                    }), {
                        status: 404,
                        headers: { 
                            'Content-Type': 'application/json', 
                            'Access-Control-Allow-Origin': '*' 
                        }
                    });
                }
            } else {
                this.debugLog("🚫 Unauthorized delete attempt", 'WARN');
                return new Response("Forbidden.", { status: 403 });
            }
        }

        // API: 获取房间状态
        if (url.pathname.endsWith('/room/status')) {
            const status = {
                totalMessages: this.messages.length,
                activeSessions: this.sessions.size,
                lastActivity: this.messages.length > 0 ? Math.max(...this.messages.map(m => m.timestamp)) : null,
                isInitialized: this.isInitialized,
                timestamp: new Date().toISOString()
            };
            
            return new Response(JSON.stringify(status), {
                headers: { 
                    'Content-Type': 'application/json', 
                    'Access-Control-Allow-Origin': '*' 
                }
            });
        }

        return new Response("API endpoint not found", { status: 404 });
    }


// ============ 辅助方法 ============

    /**
     * 【新增或确认存在】统一转发WebRTC信令的函数
     * @param {string} type - 消息类型 (offer, answer, candidate, call_end)
     * @param {object} fromSession - 发送方的会话对象
     * @param {object} payload - 消息的载荷，必须包含 target 用户名
     */
    forwardRtcSignal(type, fromSession, payload) {
        if (!payload.target) {
            this.debugLog(`❌ RTC signal of type "${type}" is missing a target.`, 'WARN', payload);
            return;
        }

        let targetSession = null;
        // 遍历所有会话，找到目标用户
        for (const session of this.sessions.values()) {
            if (session.username === payload.target) {
                targetSession = session;
                break;
            }
        }
        
        if (targetSession && targetSession.ws.readyState === WebSocket.OPEN) {
            this.debugLog(`➡️ Forwarding RTC signal "${type}" from ${fromSession.username} to ${payload.target}`);
            
            // 重新构建要发送的消息，将 from 用户名加入 payload
            const messageToSend = {
                type: type,
                payload: {
                    ...payload,
                    from: fromSession.username // 告诉接收方是谁发来的信令
                }
            };

            try {
                targetSession.ws.send(JSON.stringify(messageToSend));
            } catch (e) {
                this.debugLog(`💥 Failed to forward RTC signal to ${payload.target}: ${e.message}`, 'ERROR');
            }
        } else {
            this.debugLog(`⚠️ Target user "${payload.target}" for RTC signal not found or not connected.`, 'WARN');
        }
    }

    // ============ WebSocket 会话处理 ============
    async handleWebSocketSession(ws, url) {
        const username = decodeURIComponent(url.searchParams.get("username") || "Anonymous");
        const sessionId = crypto.randomUUID();
        const now = Date.now();
        
        // 创建会话对象
        const session = {
            id: sessionId,
            username,
            ws,
            joinTime: now,
            lastSeen: now
        };
        
        // 将会话添加到 Map 中
        this.sessions.set(sessionId, session);
        
        // 同时在 WebSocket 对象上保存会话信息，用于事件处理
        ws.sessionId = sessionId;

        this.debugLog(`✅ 接受用户连接: ${username} (Session: ${sessionId}). Total sessions: ${this.sessions.size}`);

        // 发送欢迎消息，包含历史记录
        const welcomeMessage = {
            type: MSG_TYPE_WELCOME,
            payload: {
                message: `欢迎 ${username} 加入聊天室!`,
                sessionId: sessionId,
                history: this.messages.slice(-50), // 只发送最近50条消息
                userCount: this.sessions.size
            }
        };
        
        try {
            ws.send(JSON.stringify(welcomeMessage));
        } catch (e) {
            this.debugLog(`❌ Failed to send welcome message: ${e.message}`, 'ERROR');
        }

        // 广播用户加入消息
        this.broadcast({ 
            type: MSG_TYPE_USER_JOIN, 
            payload: { 
                username,
                userCount: this.sessions.size
            } 
        }, sessionId);
        
        // 保存状态
        await this.saveState();
    }

    // ============ WebSocket 事件处理器 ============
// ============ WebSocket 事件处理器 (修正版) ============
    async webSocketMessage(ws, message) {
        const sessionId = ws.sessionId;
        const session = this.sessions.get(sessionId);
        
        if (!session) {
            this.debugLog(`❌ No session found for WebSocket (SessionId: ${sessionId})`, 'ERROR');
            ws.close(1011, "Session not found.");
            return;
        }

        session.lastSeen = Date.now();
        this.debugLog(`📨 Received WebSocket message from ${session.username}: ${message.substring(0, 150)}...`);

        try {
            const data = JSON.parse(message);
            
            // --- 核心修改：恢复WebRTC信令处理 ---
            switch (data.type) {
                case MSG_TYPE_CHAT:
                    await this.handleChatMessage(session, data.payload); 
                    break;
                case MSG_TYPE_DELETE:
                    await this.handleDeleteMessage(session, data.payload);
                    break;
                case MSG_TYPE_HEARTBEAT:
                    this.debugLog(`💓 收到心跳包💓 ${session.username}`, 'HEARTBEAT');
                    break;

                // --- 【新增】恢复WebRTC信令转发逻辑 ---
                case 'offer':
                case 'answer':
                case 'candidate':
                case 'call_end':
                    // 调用一个统一的转发函数来处理所有WebRTC信令
                    this.forwardRtcSignal(data.type, session, data.payload);
                    break;

                default:
                    this.debugLog(`⚠️ Unhandled message type: ${data.type}`, 'WARN', data);
            }
        } catch (e) { 
            this.debugLog(`❌ Failed to parse WebSocket message: ${e.message}`, 'ERROR');
            // ... (错误处理逻辑保持不变)
        }
    }

    async webSocketClose(ws, code, reason, wasClean) {
        const sessionId = ws.sessionId;
        const session = this.sessions.get(sessionId);
        
        if (session) {
            this.debugLog(`🔌 断开其连接: ${session.username} (Session: ${sessionId}). Code: ${code}, 原因: ${reason}, 清理: ${wasClean}`);
            
            // 从会话列表中移除
            this.sessions.delete(sessionId);
            
            // 广播用户离开消息
            this.broadcast({ 
                type: MSG_TYPE_USER_LEAVE, 
                payload: { 
                    username: session.username,
                    userCount: this.sessions.size
                } 
            });
            
            this.debugLog(`📊 Remaining sessions: ${this.sessions.size}`);
            
            // 保存状态
            await this.saveState();
        } else {
            this.debugLog(`🔌 断开未知连接： (SessionId: ${sessionId}). Code: ${code}`);
        }
    }
    
    async webSocketError(ws, error) {
        const sessionId = ws.sessionId;
        const session = this.sessions.get(sessionId);
        const username = session ? session.username : 'unknown';
        
        this.debugLog(`💥 WebSocket error for ${username}: ${error}`, 'ERROR');
        
        // 触发关闭处理
        this.cleanupSession(sessionId, { code: 1011, reason: "An error occurred", wasClean: false });
    }

    // ============ 核心业务逻辑 ============
    async handleChatMessage(session, payload) {
        // 打印完整的 payload 方便调试，可以确认内部 type
        this.debugLog(`💬 Handling chat message from ${session.username}`, 'INFO', payload);
        
        let messageContentValid = false;
        // 获取内部 payload 的 type
        const messageType = payload.type; 
        
        // 【关键修正】将 'chat' 类型也视为文本消息，并将其规范为 'text'
        if (messageType === 'text' || messageType === 'chat') { 
            if (payload.text && payload.text.trim().length > 0) {
                messageContentValid = true;
            }
        } else if (messageType === 'image') {
            if (payload.imageUrl) {
                messageContentValid = true;
            }
            // 图片消息可以有可选的 caption，即使 text/caption 为空也视为有效
        } else if (messageType === 'audio') {
            if (payload.audioUrl) {
                messageContentValid = true;
            }
        } else {
            // 未知或不支持的消息类型
            this.debugLog(`⚠️ Unsupported message type: ${messageType}`, 'WARN', payload);
            try {
                session.ws.send(JSON.stringify({
                    type: MSG_TYPE_ERROR,
                    payload: { message: "不支持的消息类型或无效内容" }
                }));
            } catch (e) { /* silently fail */ }
            return;
        }

        if (!messageContentValid) {
            this.debugLog(`❌ Invalid or empty content for message type ${messageType} from ${session.username}`, 'WARN', payload);
            try {
                session.ws.send(JSON.stringify({
                    type: MSG_TYPE_ERROR,
                    payload: { message: "消息内容无效或为空。" }
                }));
            } catch (e) { /* silently fail */ }
            return;
        }

        // 防止文本或标题过长 (仅对文本和图片标题进行长度限制)
        const textContentToCheckLength = payload.text || payload.caption || '';
        if (textContentToCheckLength.length > 10000) {
            this.debugLog(`❌ Message text/caption too long from ${session.username}`, 'WARN');
            try {
                session.ws.send(JSON.stringify({
                    type: MSG_TYPE_ERROR,
                    payload: { message: "消息文本或标题过长，请控制在10000字符以内" }
                }));
            } catch (e) {
                this.debugLog(`❌ Failed to send error message: ${e.message}`, 'ERROR');
            }
            return;
        }
        
        const message = {
            id: payload.id || crypto.randomUUID(), // 使用前端提供的ID（乐观更新），否则生成新ID
            username: session.username,
            timestamp: payload.timestamp || Date.now(), // 使用前端提供的时间戳（乐观更新），否则用当前时间
            text: payload.text?.trim() || '',
            // 【核心修正】将内部 'chat' 类型规范为 'text' 存储
            type: messageType === 'chat' ? 'text' : messageType 
        };
        
        // 如果是图片消息，保存图片数据
        if (messageType === 'image') {
            message.imageUrl = payload.imageUrl; 
            message.filename = payload.filename;
            message.size = payload.size;
            message.caption = payload.caption?.trim() || ''; 
        } else if (messageType === 'audio') { 
            message.audioUrl = payload.audioUrl;
            message.filename = payload.filename;
            message.size = payload.size;
        }
        
        await this.addAndBroadcastMessage(message);
    }

    async handleDeleteMessage(session, payload) { 
        const messageId = payload.id;
        if (!messageId) {
            this.debugLog(`❌ Delete request from ${session.username} is missing message ID.`, 'WARN');
            return;
        }

        const initialLength = this.messages.length;
        const messageToDelete = this.messages.find(m => m.id === messageId);

        // 安全检查：确保消息存在，并且是该用户自己发送的
        if (messageToDelete && messageToDelete.username === session.username) {
            this.messages = this.messages.filter(m => m.id !== messageId);
            
            if (this.messages.length < initialLength) {
                this.debugLog(`🗑️ Message ${messageId} deleted by ${session.username}.`);
                
                await this.saveState();
                
                this.broadcast({ 
                    type: MSG_TYPE_DELETE, 
                    payload: { messageId } 
                });
            }
        } else {
            let reason = messageToDelete ? "permission denied" : "message not found";
            this.debugLog(`🚫 Unauthorized delete attempt by ${session.username} for message ${messageId}. Reason: ${reason}`, 'WARN');
            
            try {
                session.ws.send(JSON.stringify({
                    type: MSG_TYPE_ERROR,
                    payload: { message: "你不能删除这条消息。" }
                }));
            } catch (e) {
                this.debugLog(`❌ 无法发送错误信息: ${e.message}`, 'ERROR');
            }
        }
    }

    // ============ 辅助方法 ============
    async addAndBroadcastMessage(message) {
        this.messages.push(message);
        if (this.messages.length > 500) this.messages.shift();
        
        await this.saveState();
        
        this.broadcast({ type: MSG_TYPE_CHAT, payload: message });
    }

    // 统一的会话清理函数
    cleanupSession(sessionId, closeInfo = {}) {
        const session = this.sessions.get(sessionId);
        if (session) {
            this.sessions.delete(sessionId);
            const { code = 'N/A', reason = 'N/A', wasClean = 'N/A' } = closeInfo;
            this.debugLog(`🔌 断开其连接: ${session.username} (Session: ${sessionId}). Code: ${code}, 原因: ${reason}, 清理: ${wasClean}`);
            
            // 广播用户离开消息
            this.broadcast({ 
                type: MSG_TYPE_USER_LEAVE, 
                payload: { 
                    username: session.username,
                    userCount: this.sessions.size
                } 
            });
            
            this.debugLog(`📊 Remaining sessions: ${this.sessions.size}`);
            
            // 使用 waitUntil 确保状态保存在实例休眠前完成
            this.ctx.waitUntil(this.saveState());
        }
    }

    fetchHistory(since = 0) {
        return since > 0 ? this.messages.filter(msg => msg.timestamp > since) : this.messages;
    }

    broadcast(message, excludeSessionId = null) {
        const stringifiedMessage = JSON.stringify(message);
        let activeSessions = 0;
        const disconnectedSessions = [];
        
        this.sessions.forEach((session, sessionId) => {
            if (sessionId === excludeSessionId) {
                return;
            }
            
            try {
                if (session.ws.readyState === WebSocket.OPEN) {
                    session.ws.send(stringifiedMessage);
                    activeSessions++;
                } else {
                    disconnectedSessions.push(sessionId);
                }
            } catch (e) {
                this.debugLog(`💥 Failed to send message to ${session.username}: ${e.message}`, 'ERROR');
                disconnectedSessions.push(sessionId);
            }
        });
        
        // 清理断开的会话
        disconnectedSessions.forEach(sessionId => {
            this.cleanupSession(sessionId, { code: 1011, reason: 'Broadcast failed', wasClean: false });
        });
        
        // 避免调试日志的广播产生无限循环
        if (message.type !== MSG_TYPE_DEBUG_LOG) {
            this.debugLog(`📡 Message broadcast to ${activeSessions} active sessions`);
        }
    }

    // ============ 清理方法 ============
    async cleanup() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        
        // 保存最终状态
        await this.saveState();
        
        this.debugLog("🧹 Cleanup completed");
    }
}