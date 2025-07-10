// 文件: src/chatroom_do.js (实现了"白名单即房间授权"的最终版)

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
const MSG_TYPE_USER_LIST_UPDATE = 'user_list_update';

// 【修改】存储键常量
const ALLOWED_USERS_KEY = 'allowed_users';

const JSON_HEADERS = {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*'
};

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
        this.allowedUsers = undefined; // ✨ 初始状态设为undefined，表示"未知"
        
        this.debugLog("🏗️ DO instance created.");
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
        
        this.debugLogs.push(logEntry);
        if (this.debugLogs.length > this.maxDebugLogs) {
            this.debugLogs.shift();
        }
        
        if (data) {
            console.log(`[${timestamp}] [${level}] ${message}`, data);
        } else {
            console.log(`[${timestamp}] [${level}] ${message}`);
        }
        
        if (level !== 'HEARTBEAT') {
            this.broadcastDebugLog(logEntry);
        }
    }

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
                // 静默处理发送失败
            }
        });
    }

    // ============ 状态管理 ============
    async initialize() {
        if (this.isInitialized) return;
        
        // 【修改】只加载白名单，因为其他状态只在会话中才需要
        const allowed = await this.ctx.storage.get(ALLOWED_USERS_KEY);

        // 【✨ 核心逻辑 ✨】
        // 如果存储中从未设置过这个key，`get`会返回undefined。
        // 我们用 `null` 来表示一个"已激活但为空"的白名单，
        // 而 `undefined` 表示"从未被管理员触碰过"的状态。
        if (allowed === undefined) {
            this.allowedUsers = undefined; // 白名单功能未对本房间激活
            this.debugLog(`ℹ️ 房间白名单未激活。此房间不允许访问。`);
        } else {
            this.allowedUsers = new Set(allowed || []); // 已激活，加载用户列表
            this.debugLog(`📁 已加载白名单. Allowed Users: ${this.allowedUsers.size}`);
        }
        
        // 只有在实际需要时才加载消息历史
        this.messages = null; 
        
        this.isInitialized = true;
    }

    async saveState() {
        if (this.allowedUsers === undefined) {
            // 如果白名单从未被激活过，我们甚至不创建这个存储键
            return;
        }

        const savePromise = this.ctx.storage.put(ALLOWED_USERS_KEY, Array.from(this.allowedUsers));
        
        this.ctx.waitUntil(savePromise);
        try {
            await savePromise;
            this.debugLog(`💾 白名单状态已保存. Allowed: ${this.allowedUsers.size}`);
        } catch (e) {
            this.debugLog(`💥 白名单状态保存失败: ${e.message}`, 'ERROR');
        }
    }

    // --- 【新增】加载消息历史的独立函数 ---
    async loadMessages() {
        if (this.messages === null) {
            this.messages = (await this.ctx.storage.get("messages")) || [];
            this.debugLog(`📨 消息历史已加载: ${this.messages.length}条`);
        }
    }
    
    // --- 【新增】保存消息历史的独立函数 ---
    async saveMessages() {
        if (this.messages === null) return;
        const savePromise = this.ctx.storage.put("messages", this.messages);
        this.ctx.waitUntil(savePromise);
        try {
            await savePromise;
            this.debugLog(`💾 消息历史已保存: ${this.messages.length}条`);
        } catch (e) {
            this.debugLog(`💥 消息历史保存失败: ${e.message}`, 'ERROR');
        }
    }

    // ============ 心跳机制 ============
    startHeartbeat() {
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
        
        disconnectedSessions.forEach(sessionId => {
            this.cleanupSession(sessionId, { code: 1011, reason: 'Heartbeat failed', wasClean: false });
        });
        
        if (activeSessions > 0) {
            this.debugLog(`💓 发送心跳包到 ${activeSessions} 个活跃会话 🟢 `, 'HEARTBEAT');
        }
    }

    // ============ RPC 方法 ============
    async postBotMessage(payload, secret) {
        if (this.env.CRON_SECRET && secret !== this.env.CRON_SECRET) {
            this.debugLog("BOT POST: Unauthorized attempt!", 'ERROR');
            return;
        }
        
        this.debugLog(`🤖 机器人自动发帖...`, 'INFO', payload);
        await this.initialize();
        
        if (this.allowedUsers === undefined) {
            this.debugLog(`🚫 拒绝机器人发帖: 房间未经授权 (白名单未激活)`, 'WARN');
            return;
        }
        
        await this.loadMessages();
        
        const message = {
            id: crypto.randomUUID(),
            username: "机器人小助手", 
            timestamp: Date.now(),
            ...payload 
        };
        
        await this.addAndBroadcastMessage(message);
    }

    async cronPost(text, secret) {
        this.debugLog(`🤖 收到定时任务, 自动发送文本消息: ${text}`);
        await this.postBotMessage({ text, type: 'text' }, secret);
    }

    // ============ 主要入口点 ============
    async fetch(request) {
        const url = new URL(request.url);
        this.debugLog(`🚘 服务端入站请求: ${request.method} ${url.pathname}`);

        await this.initialize();

        if (request.headers.get("Upgrade") === "websocket") {
            return await this.handleWebSocketUpgrade(request, url);
        }
        
        if (url.pathname.startsWith('/api/')) {
            return await this.handleApiRequest(request);
        }

        if (request.method === "GET") {
            this.debugLog(`📄 发送HTML文件: ${url.pathname}`);
            return new Response(null, {
                headers: { "X-DO-Request-HTML": "true" },
            });
        }

        this.debugLog(`❓ 未处理连接🔗: ${request.method} ${url.pathname}`, 'WARN');
        return new Response("Not Found", { status: 404 });
    }

   // ============ 【修正版】WebSocket升级处理器 ============
    async handleWebSocketUpgrade(request, url) {
        const username = decodeURIComponent(url.searchParams.get("username") || "Anonymous");
        
        // 1. 创建 WebSocketPair
        const { 0: client, 1: server } = new WebSocketPair();
        
        // 2. 接受 WebSocket 连接 (这是发送关闭码的前提)
        this.ctx.acceptWebSocket(server);

        // 3. 执行权限检查
        // 如果白名单功能未激活
        if (this.allowedUsers === undefined) {
            this.debugLog(`🚫 拒绝连接: 房间未经授权 (白名单未激活). 用户: ${username}`, 'WARN');
            // 立即关闭 WebSocket 连接，并发送明确的 1008 策略违反码和原因
            server.close(1008, "拒绝连接，房间未经授权（白名单未激活），请联系管理员：yuangunangshan@gmail.com.");
            // 返回 101 状态码，因为 WebSocket 升级本身是成功的，但连接会立即被关闭
            return new Response(null, { status: 101, webSocket: client });
        }
        
        // 如果白名单已激活但用户不在名单上
        if (!this.allowedUsers.has(username)) {
            this.debugLog(`🚫 拒绝连接: 用户 ${username} 不在白名单中`, 'WARN');
            // 立即关闭 WebSocket 连接，并发送明确的 1008 策略违反码和原因
            server.close(1008, "拒绝连接，房间未经授权（白名单未激活），请联系管理员：yuangunangshan@gmail.com.");
            // 返回 101 状态码，因为 WebSocket 升级本身是成功的，但连接会立即被关闭
            return new Response(null, { status: 101, webSocket: client });
        }
        
        // 4. 如果所有检查通过，则继续处理会话
        this.debugLog(`✅ 授权用户连接: ${username}`);
        await this.handleWebSocketSession(server, url, username);
        // 返回 101 状态码，表示 WebSocket 升级成功
        return new Response(null, { status: 101, webSocket: client });
    }

    // ============ API 请求处理 ============
    async handleApiRequest(request) {
        const url = new URL(request.url);
        
        // 【修改】用户管理API
        if (url.pathname.endsWith('/users/list')) {
            if (this.allowedUsers === undefined) {
                return new Response(JSON.stringify({
                    users: [],
                    count: 0,
                    active: false
                }), { headers: JSON_HEADERS });
            }
            
            return new Response(JSON.stringify({
                users: Array.from(this.allowedUsers),
                count: this.allowedUsers.size,
                active: true
            }), { headers: JSON_HEADERS });
        }
        
        if (url.pathname.endsWith('/users/add') && request.method === 'POST') {
            const secret = url.searchParams.get('secret');
            if (this.env.ADMIN_SECRET && secret !== this.env.ADMIN_SECRET) {
                this.debugLog("🚫 Unauthorized user add attempt", 'WARN');
                return new Response("Forbidden.", { status: 403 });
            }
            
            try {
                const { username } = await request.json();
                if (username && username.trim()) {
                    const cleanUsername = username.trim();
                    
                    // 【✨ 核心变更】首次添加用户时激活白名单
                    if (this.allowedUsers === undefined) {
                        this.allowedUsers = new Set();
                        this.debugLog(`✨ 房间白名单已激活！`, 'INFO');
                    }
                    
                    this.allowedUsers.add(cleanUsername);
                    await this.saveState();
                    this.debugLog(`✅ 用户 ${cleanUsername} 已添加到白名单`);
                    return new Response(JSON.stringify({ 
                        success: true, 
                        user: cleanUsername, 
                        action: 'added',
                        totalUsers: this.allowedUsers.size,
                        active: true
                    }), { headers: JSON_HEADERS });
                }
                return new Response('Missing or empty username', { status: 400 });
            } catch (e) {
                return new Response('Invalid JSON', { status: 400 });
            }
        }
        
        if (url.pathname.endsWith('/users/remove') && request.method === 'POST') {
            const secret = url.searchParams.get('secret');
            if (this.env.ADMIN_SECRET && secret !== this.env.ADMIN_SECRET) {
                this.debugLog("🚫 Unauthorized user remove attempt", 'WARN');
                return new Response("Forbidden.", { status: 403 });
            }
            
            try {
                const { username } = await request.json();
                if (username && username.trim()) {
                    // 【修改】检查白名单是否已激活
                    if (this.allowedUsers === undefined) {
                        return new Response('Whitelist not active for this room', { status: 404 });
                    }
                    
                    const cleanUsername = username.trim();
                    const deleted = this.allowedUsers.delete(cleanUsername);
                    if (deleted) {
                        await this.saveState();
                        this.debugLog(`🗑️ 用户 ${cleanUsername} 已从白名单移除`);
                        
                        // 断开该用户的现有连接
                        this.sessions.forEach((session, sessionId) => {
                            if (session.username === cleanUsername) {
                                this.debugLog(`⚡ 断开已移除用户的连接: ${cleanUsername}`);
                                session.ws.close(1008, "User removed from allowed list");
                            }
                        });
                        
                        return new Response(JSON.stringify({ 
                            success: true, 
                            user: cleanUsername, 
                            action: 'removed',
                            totalUsers: this.allowedUsers.size
                        }), { headers: JSON_HEADERS });
                    } else {
                        return new Response('User not found in allowed list', { status: 404 });
                    }
                }
                return new Response('Missing or empty username', { status: 400 });
            } catch (e) {
                return new Response('Invalid JSON', { status: 400 });
            }
        }
        
        // 【修改】清空白名单API
        if (url.pathname.endsWith('/users/clear') && request.method === 'POST') {
            const secret = url.searchParams.get('secret');
            if (this.env.ADMIN_SECRET && secret !== this.env.ADMIN_SECRET) {
                this.debugLog("🚫 Unauthorized user clear attempt", 'WARN');
                return new Response("Forbidden.", { status: 403 });
            }
            
            // 【修改】检查白名单是否已激活
            if (this.allowedUsers === undefined) {
                return new Response('Whitelist not active for this room', { status: 404 });
            }
            
            const previousCount = this.allowedUsers.size;
            this.allowedUsers.clear();
            await this.saveState();
            this.debugLog(`🧹 白名单已清空，移除了 ${previousCount} 个用户`);
            
            return new Response(JSON.stringify({ 
                success: true, 
                cleared: previousCount,
                totalUsers: 0
            }), { headers: JSON_HEADERS });
        }
        
        // 【修改】消息历史API
        if (url.pathname.endsWith('/messages/history')) {
            // 【修改】检查白名单是否已激活
            if (this.allowedUsers === undefined) {
                return new Response('Room not found or not activated', { status: 404 });
            }
            
            await this.loadMessages(); // 延迟加载消息
            const since = parseInt(url.searchParams.get('since') || '0', 10);
            const history = this.fetchHistory(since);
            this.debugLog(`📜 请求历史消息. Since: ${since}, 返回: ${history.length} 条消息`);
            return new Response(JSON.stringify(history), { headers: JSON_HEADERS });
        }

        // 【修改】消息删除API
        if (url.pathname.endsWith('/messages/delete')) {
            const messageId = url.searchParams.get('id');
            const secret = url.searchParams.get('secret');
            
            // 【修改】检查白名单是否已激活
            if (this.allowedUsers === undefined) {
                return new Response('Room not found or not activated', { status: 404 });
            }
            
            if (this.env.ADMIN_SECRET && secret === this.env.ADMIN_SECRET) {
                await this.loadMessages(); // 延迟加载消息
                
                const originalCount = this.messages.length;
                this.messages = this.messages.filter(msg => msg.id !== messageId);
                const deleted = originalCount - this.messages.length;
                
                if (deleted > 0) {
                    await this.saveMessages();
                    this.debugLog(`🗑️ Message deleted: ${messageId}`);
                    this.broadcast({ type: MSG_TYPE_DELETE, payload: { messageId } });
                    return new Response(JSON.stringify({
                        message: "消息删除成功",
                        deleted: deleted
                    }), { headers: JSON_HEADERS });
                } else {
                    return new Response(JSON.stringify({
                        message: "Message not found"
                    }), { status: 404, headers: JSON_HEADERS });
                }
            } else {
                this.debugLog("🚫 Unauthorized delete attempt", 'WARN');
                return new Response("Forbidden.", { status: 403 });
            }
        }

        // 【修改】房间状态API
        if (url.pathname.endsWith('/room/status')) {
            let status = {
                allowedUsers: this.allowedUsers === undefined ? 0 : this.allowedUsers.size,
                activeSessions: this.sessions.size,
                isInitialized: this.isInitialized,
                active: this.allowedUsers !== undefined,
                timestamp: new Date().toISOString()
            };
            
            // 只有在白名单已激活的情况下才加载消息
            if (this.allowedUsers !== undefined) {
                if (this.messages === null) {
                    const messageCount = (await this.ctx.storage.get("messages_count")) || 0;
                    status.totalMessages = messageCount;
                } else {
                    status.totalMessages = this.messages.length;
                    status.lastActivity = this.messages.length > 0 ? 
                        Math.max(...this.messages.map(m => m.timestamp)) : null;
                }
            }
            
            return new Response(JSON.stringify(status), { headers: JSON_HEADERS });
        }

        // 调试日志API
        if (url.pathname.endsWith('/debug/logs')) {
            this.debugLog(`🔍 请求debug信息. Total logs: ${this.debugLogs.length}`);
            return new Response(JSON.stringify({
                logs: this.debugLogs,
                totalLogs: this.debugLogs.length,
                activeSessions: this.sessions.size,
                allowedUsers: this.allowedUsers === undefined ? 0 : this.allowedUsers.size,
                active: this.allowedUsers !== undefined,
                timestamp: new Date().toISOString()
            }), { headers: JSON_HEADERS });
        }
        
        if (url.pathname.endsWith('/debug/sessions')) {
            const sessionInfo = this.getActiveUserList(true);
            return new Response(JSON.stringify({
                sessions: sessionInfo,
                totalSessions: this.sessions.size,
                timestamp: new Date().toISOString()
            }), { headers: JSON_HEADERS });
        }
        
        if (url.pathname.endsWith('/debug/clear')) {
            const clearedCount = this.debugLogs.length;
            this.debugLogs = [];
            this.debugLog(`🧹 Debug logs cleared. Cleared ${clearedCount} logs`);
            return new Response(JSON.stringify({
                message: `Cleared ${clearedCount} debug logs`,
                timestamp: new Date().toISOString()
            }), { headers: JSON_HEADERS });
        }
        
        // 【修改】房间重置API
        if (url.pathname.endsWith('/reset-room')) {
            const secret = url.searchParams.get('secret');
            if (this.env.ADMIN_SECRET && secret === this.env.ADMIN_SECRET) {
                await this.ctx.storage.deleteAll();
                this.messages = [];
                this.sessions.clear();
                this.debugLogs = [];
                this.allowedUsers = undefined; // 【修改】将白名单重置为未激活状态
                this.debugLog("🔄 Room reset successfully");
                this.broadcastUserListUpdate();
                return new Response("Room has been reset successfully.", { status: 200 });
            } else {
                this.debugLog("🚫 Unauthorized reset attempt", 'WARN');
                return new Response("Forbidden.", { status: 403 });
            }
        }

        return new Response("API endpoint not found", { status: 404 });
    }

    // ============ 辅助方法 ============
    getActiveUserList(detailed = false) {
        if (detailed) {
            return Array.from(this.sessions.values()).map(session => ({
                id: session.id,
                username: session.username,
                joinTime: session.joinTime,
                lastSeen: session.lastSeen,
                isConnected: session.ws.readyState === WebSocket.OPEN
            }));
        } else {
            return Array.from(this.sessions.values()).map(session => ({
                id: session.id,
                username: session.username
            }));
        }
    }

    broadcastUserListUpdate() {
        const users = this.getActiveUserList();
        this.broadcast({
            type: MSG_TYPE_USER_LIST_UPDATE,
            payload: {
                users: users,
                userCount: users.length
            }
        });
        this.debugLog(`📡 已广播最新在线用户列表，当前 ${users.length} 位在线用户。`);
    }

    forwardRtcSignal(type, fromSession, payload) {
        if (!payload.target) {
            this.debugLog(`❌ RTC signal of type "${type}" is missing a target.`, 'WARN', payload);
            return;
        }

        let targetSession = null;
        for (const session of this.sessions.values()) {
            if (session.username === payload.target) {
                targetSession = session;
                break;
            }
        }
        
        if (targetSession && targetSession.ws.readyState === WebSocket.OPEN) {
            this.debugLog(`➡️ Forwarding RTC signal "${type}" from ${fromSession.username} to ${payload.target}`);
            
            const messageToSend = {
                type: type,
                payload: {
                    ...payload,
                    from: fromSession.username
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
    async handleWebSocketSession(ws, url, username) {
        const sessionId = crypto.randomUUID();
        const now = Date.now();
        
        const session = {
            id: sessionId,
            username,
            ws,
            joinTime: now,
            lastSeen: now
        };
        
        this.sessions.set(sessionId, session);
        ws.sessionId = sessionId;

        this.debugLog(`✅ 接受用户连接: 👦 ${username} (Session: ${sessionId}). Total sessions: ${this.sessions.size}`);

        // 【修改】在用户成功连接后，才加载消息历史
        await this.loadMessages();

        const welcomeMessage = {
            type: MSG_TYPE_WELCOME,
            payload: {
                message: `👏 欢迎 ${username} 加入聊天室 💬!`,
                sessionId: sessionId,
                history: this.messages.slice(-50),
                userCount: this.sessions.size
            }
        };
        
        try {
            ws.send(JSON.stringify(welcomeMessage));
        } catch (e) {
            this.debugLog(`❌ Failed to send welcome message to 👦 ${username}: ${e.message}`, 'ERROR');
        }

        this.broadcast({ 
            type: MSG_TYPE_USER_JOIN, 
            payload: { 
                username,
                userCount: this.sessions.size
            } 
        }, sessionId);

        this.broadcastUserListUpdate();
        await this.saveState();
    }

    // ============ WebSocket 事件处理器 ============
    async webSocketMessage(ws, message) {
        const sessionId = ws.sessionId;
        const session = this.sessions.get(sessionId);
        
        if (!session) {
            this.debugLog(`❌ No session found for WebSocket (SessionId: ${sessionId})`, 'ERROR');
            ws.close(1011, "Session not found.");
            return;
        }

        session.lastSeen = Date.now();
        this.debugLog(`📨 收到用户： 👦  ${session.username} 的消息: ${message.substring(0, 150)}...`);

        try {
            const data = JSON.parse(message);
            
            switch (data.type) {
                case MSG_TYPE_CHAT:
                    await this.handleChatMessage(session, data.payload); 
                    break;
                case MSG_TYPE_DELETE:
                    await this.handleDeleteMessage(session, data.payload);
                    break;
                case MSG_TYPE_HEARTBEAT:
                    this.debugLog(`💓 收到心跳包💓 👦  ${session.username}`, 'HEARTBEAT');
                    break;
                case 'offer':
                case 'answer':
                case 'candidate':
                case 'call_end':
                    this.forwardRtcSignal(data.type, session, data.payload);
                    break;
                default:
                    this.debugLog(`⚠️ Unhandled message type: ${data.type} from 👦 ${session.username}`, 'WARN', data);
            }
        } catch (e) { 
            this.debugLog(`❌ Failed to parse WebSocket message from 👦 ${session.username}: ${e.message}`, 'ERROR');
        }
    }

    async webSocketClose(ws, code, reason, wasClean) {
        const sessionId = ws.sessionId;
        const session = this.sessions.get(sessionId);
        const username = session ? session.username : 'unknown';
        
        this.debugLog(`💤 断开连接: 👦 ${username} (Session: ${sessionId}). Code: ${code}, 原因: ${reason}, 清理: ${wasClean}`);
        this.cleanupSession(sessionId, { code, reason, wasClean });
    }
    
    async webSocketError(ws, error) {
        const sessionId = ws.sessionId;
        const session = this.sessions.get(sessionId);
        const username = session ? session.username : 'unknown';
        
        this.debugLog(`💥 WebSocket error for 👦 ${username}: ${error}`, 'ERROR');
        this.cleanupSession(sessionId, { code: 1011, reason: "An error occurred", wasClean: false });
    }

    // ============ 核心业务逻辑 ============
    async handleChatMessage(session, payload) {
        // 【修改】在处理第一条消息前，确保历史已加载
        await this.loadMessages();
        
        this.debugLog(`💬 正在处理用户：👦 ${session.username} 的消息`, 'INFO', payload);
        
        let messageContentValid = false;
        const messageType = payload.type; 
        
        if (messageType === 'text' || messageType === 'chat') { 
            if (payload.text && payload.text.trim().length > 0) {
                messageContentValid = true;
            }
        } else if (messageType === 'image') {
            if (payload.imageUrl) {
                messageContentValid = true;
            }
        } else if (messageType === 'audio') {
            if (payload.audioUrl) {
                messageContentValid = true;
            }
        } else {
            this.debugLog(`⚠️ 不支持的消息类型或无效内容: ${messageType} from 👦 ${session.username}`, 'WARN', payload);
            try {
                session.ws.send(JSON.stringify({
                    type: MSG_TYPE_ERROR,
                    payload: { message: "不支持的消息类型或无效内容" }
                }));
            } catch (e) { /* silently fail */ }
            return;
        }

        if (!messageContentValid) {
            this.debugLog(`❌ 消息内容无效或为空 ${messageType} from 👦 ${session.username}`, 'WARN', payload);
            try {
                session.ws.send(JSON.stringify({
                    type: MSG_TYPE_ERROR,
                    payload: { message: "消息内容无效或为空。" }
                }));
            } catch (e) { /* silently fail */ }
            return;
        }

        const textContentToCheckLength = payload.text || payload.caption || '';
        if (textContentToCheckLength.length > 10000) {
            this.debugLog(`❌ 消息文本或标题过长，请控制在1万字符以内 👦 ${session.username}`, 'WARN');
            try {
                session.ws.send(JSON.stringify({
                    type: MSG_TYPE_ERROR,
                    payload: { message: "❗ 消息文本或标题过长，请控制在10000字符以内" }
                }));
            } catch (e) {
                this.debugLog(`❌ Failed to send error message to 👦 ${session.username}: ${e.message}`, 'ERROR');
            }
            return;
        }
        
        const message = {
            id: payload.id || crypto.randomUUID(),
            username: session.username,
            timestamp: payload.timestamp || Date.now(),
            text: payload.text?.trim() || '',
            type: messageType === 'chat' ? 'text' : messageType 
        };
        
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
        // 【修改】在处理删除消息前，确保历史已加载
        await this.loadMessages();
        
        const messageId = payload.id;
        if (!messageId) {
            this.debugLog(`❌ 正在处理用户： 👦 ${session.username} 的消息删除请求，message ID.`, 'WARN');
            return;
        }

        const initialLength = this.messages.length;
        const messageToDelete = this.messages.find(m => m.id === messageId);

        if (messageToDelete && messageToDelete.username === session.username) {
            this.messages = this.messages.filter(m => m.id !== messageId);
            
            if (this.messages.length < initialLength) {
                this.debugLog(`🗑️ 此消息： ${messageId} 已被用户： 👦 ${session.username}删除.`);
                await this.saveMessages();
                this.broadcast({ type: MSG_TYPE_DELETE, payload: { messageId } });
            }
        } else {
            let reason = messageToDelete ? "permission denied" : "message not found";
            this.debugLog(`🚫 Unauthorized delete attempt by 👦 ${session.username} for message ${messageId}. Reason: ${reason}`, 'WARN');
            
            try {
                session.ws.send(JSON.stringify({
                    type: MSG_TYPE_ERROR,
                    payload: { message: "你不能删除这条消息。" }
                }));
            } catch (e) {
                this.debugLog(`❌ 无法发送错误信息 to 👦 ${session.username}: ${e.message}`, 'ERROR');
            }
        }
    }

    async addAndBroadcastMessage(message) {
        this.messages.push(message);
        if (this.messages.length > 500) this.messages.shift();
        
        await this.saveMessages();
        this.broadcast({ type: MSG_TYPE_CHAT, payload: message });
    }

    // 统一的会话清理函数
    cleanupSession(sessionId, closeInfo = {}) {
        const session = this.sessions.get(sessionId);
        // 获取用户名，如果会话不存在则默认为 'unknown'
        const username = session ? session.username : 'unknown';

        if (session) {
            this.sessions.delete(sessionId);
            const { code = 'N/A', reason = 'N/A', wasClean = 'N/A' } = closeInfo;
            // 打印会话所属的用户
            this.debugLog(`💤 断开用户连接: 👦 ${username} (Session: ${sessionId}). Code: ${code}, 原因: ${reason}, 清理: ${wasClean}`);
            
            // 广播用户离开消息（可选，如果前端只依赖用户列表更新，此消息可省略）
            this.broadcast({ 
                type: MSG_TYPE_USER_LEAVE, 
                payload: { 
                    username: username,
                    userCount: this.sessions.size
                } 
            });
            
            // 用户离开后，广播最新的在线用户列表给所有剩余客户端
            this.broadcastUserListUpdate();

            this.debugLog(`👭 当前有效会话数: ${this.sessions.size}`);
            
            // 使用 waitUntil 确保状态保存在实例休眠前完成
            this.ctx.waitUntil(this.saveState());
        } else {
             // 对于找不到会话的情况也打印用户名（虽然是unknown）
            this.debugLog(`💤 尝试清理未知会话 (SessionId: ${sessionId}). Code: ${closeInfo.code}, 原因: ${closeInfo.reason}`, 'WARN');
        }
    }

    fetchHistory(since = 0) {
        return since > 0 ? this.messages.filter(msg => msg.timestamp > since) : this.messages;
    }

    broadcast(message, excludeSessionId = null) {
        const stringifiedMessage = JSON.stringify(message);
        let activeSessions = 0;
        const disconnectedSessions = [];
        const activeUsernames = []; 
        
        this.sessions.forEach((session, sessionId) => {
            if (sessionId === excludeSessionId) {
                return;
            }
            
            try {
                if (session.ws.readyState === WebSocket.OPEN) {
                    session.ws.send(stringifiedMessage);
                    activeSessions++;
                    // 仅在广播普通消息时，才收集用户名用于日志
                    if (message.type !== MSG_TYPE_DEBUG_LOG && message.type !== MSG_TYPE_USER_LIST_UPDATE) {
                         activeUsernames.push(session.username); 
                    }
                } else {
                    disconnectedSessions.push(sessionId);
                }
            } catch (e) {
                this.debugLog(`💥 Failed to send message to 👦 ${session.username}: ${e.message}`, 'ERROR');
                disconnectedSessions.push(sessionId);
            }
        });
        
        // 清理断开的会话
        disconnectedSessions.forEach(sessionId => {
            this.cleanupSession(sessionId, { code: 1011, reason: 'Broadcast failed', wasClean: false });
        });
        
        // 避免调试日志的广播产生无限循环
        // 并且避免对 MSG_TYPE_USER_LIST_UPDATE 消息重复打印用户列表
        if (message.type !== MSG_TYPE_DEBUG_LOG && message.type !== MSG_TYPE_USER_LIST_UPDATE) {
            let logMessage = `📡 广播消息给 ${activeSessions} 位活跃会话 🟢`;
            
            if (activeSessions > 0) {
                const userListString = activeUsernames.join(', ');
                logMessage += `：${userListString}`; 
            } else {
                logMessage += ` (无活跃用户)`; 
            }
            
            this.debugLog(logMessage, 'INFO');
        }
    }

    // ============ 清理方法 ============
    async cleanup() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        
        // 保存最终状态
        if (this.messages !== null) {
            await this.saveMessages();
        }
        await this.saveState();
        
        this.debugLog("🧹 清理结束");
    }
}