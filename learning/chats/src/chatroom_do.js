// 文件: src/chatroom_do.js (完整整合版本)

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

export class HibernatingChatRoom extends DurableObject {
    constructor(ctx, env) {
        super(ctx, env);
        this.ctx = ctx;
        this.env = env;
        this.messages = null;
        this.sessions = new Map(); // 使用 Map 来更好地管理会话
        this.debugLogs = [];
        this.maxDebugLogs = 100;
        this.isInitialized = false;
        this.heartbeatInterval = null;
        
        this.debugLog("🏗️ DO instance created.");
        
        // 启动心跳机制
        this.startHeartbeat();
    }

    // ============ 调试日志系统 ============
    debugLog(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            id: crypto.randomUUID().substring(0, 8)
        };
        
        // 添加到内存日志
        this.debugLogs.push(logEntry);
        if (this.debugLogs.length > this.maxDebugLogs) {
            this.debugLogs.shift();
        }
        
        // 同时输出到控制台
        console.log(`[${timestamp}] [${level}] ${message}`);
        
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
        
        this.sessions.forEach((session, sessionId) => {
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
    async loadState() {
        if (this.messages !== null) return;
        
        // 加载消息历史
        this.messages = (await this.ctx.storage.get("messages")) || [];
        
        // 尝试恢复会话信息（虽然 WebSocket 连接无法恢复，但可以恢复会话元数据）
        const savedSessionsData = await this.ctx.storage.get("sessions_metadata");
        if (savedSessionsData) {
            this.debugLog(`📁 Found ${savedSessionsData.length} saved session metadata entries`);
        }
        
        this.debugLog(`📁 State loaded. Messages: ${this.messages.length}`);
        this.isInitialized = true;
    }

    async saveState() {
        if (this.messages === null) return;
        
        await this.ctx.storage.put("messages", this.messages);
        
        // 保存会话元数据（不包括 WebSocket 对象）
        const sessionMetadata = Array.from(this.sessions.entries()).map(([id, session]) => ({
            id,
            username: session.username,
            joinTime: session.joinTime,
            lastSeen: session.lastSeen
        }));
        
        await this.ctx.storage.put("sessions_metadata", sessionMetadata);
        
        this.debugLog(`💾 State saved. Messages: ${this.messages.length}, Sessions: ${this.sessions.size}`);
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
            const session = this.sessions.get(sessionId);
            if (session) {
                this.debugLog(`🧹 Cleaning up disconnected session: ${session.username}`);
                this.sessions.delete(sessionId);
            }
        });
        
        if (activeSessions > 0) {
            this.debugLog(`💓 Heartbeat sent to ${activeSessions} active sessions`, 'HEARTBEAT');
        }
    }

    // ============ RPC 方法 ============
    async cronPost(text, secret) {
        if (this.env.CRON_SECRET && secret !== this.env.CRON_SECRET) {
            this.debugLog("CRON RPC: Unauthorized attempt!", 'ERROR');
            return;
        }
        this.debugLog(`🤖 Cron posting message: ${text}`);
        await this.handleChatMessage({ username: "小助手" }, { text, type: 'text' });
    }

    // ============ 主要入口点 ============
    async fetch(request) {
        const url = new URL(request.url);
        this.debugLog(`📥 Incoming request: ${request.method} ${url.pathname}`);

        // 确保状态已加载
        if (!this.isInitialized) {
            await this.loadState();
        }

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
            this.debugLog(`📄 Returning HTML page for: ${url.pathname}`);
            return new Response(null, {
                headers: { "X-DO-Request-HTML": "true" },
            });
        }

        this.debugLog(`❓ Unhandled request: ${request.method} ${url.pathname}`, 'WARN');
        return new Response("Not Found", { status: 404 });
    }

    // ============ API 请求处理 ============
    async handleApiRequest(url) {
        // API: 获取调试日志
        if (url.pathname.endsWith('/debug/logs')) {
            this.debugLog(`🔍 Debug logs requested. Total logs: ${this.debugLogs.length}`);
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
            this.debugLog(`📜 History requested. Since: ${since}, Returned: ${history.length} messages`);
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
                        message: "Message deleted successfully",
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

    // ============ WebSocket 会话处理 ============
    async handleWebSocketSession(ws, url) {
        let username = decodeURIComponent(url.searchParams.get("username") || "Anonymous");
        const sessionId = crypto.randomUUID();
        const now = Date.now();
                // --- 新增：为匿名用户添加随机后缀 ---
        if (username === "Anonymous") {
            username = `Anonymous-${crypto.randomUUID().substring(0, 4)}`;
        }
        
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

        this.debugLog(`✅ WebSocket connected for: ${username} (Session: ${sessionId}). Total sessions: ${this.sessions.size}`);

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
    async webSocketMessage(ws, message) {
        const sessionId = ws.sessionId;
        const session = this.sessions.get(sessionId);
        
        if (!session) {
            this.debugLog(`❌ No session found for WebSocket (SessionId: ${sessionId})`, 'ERROR');
            // 尝试发送错误消息
            try {
                ws.send(JSON.stringify({
                    type: MSG_TYPE_ERROR,
                    payload: { message: "会话已失效，请刷新页面重新连接" }
                }));
            } catch (e) {
                this.debugLog(`❌ Failed to send error message: ${e.message}`, 'ERROR');
            }
            return;
        }

        // 更新最后活跃时间
        session.lastSeen = Date.now();
        
        this.debugLog(`📨 Received WebSocket message from ${session.username}: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);

        try {
            const data = JSON.parse(message);
            
            if (data.type === MSG_TYPE_CHAT) {
                await this.handleChatMessage(session, data.payload);
            } else if (data.type === MSG_TYPE_HEARTBEAT) {
                // 心跳响应，不需要特殊处理
                this.debugLog(`💓 Heartbeat received from ${session.username}`, 'HEARTBEAT');
            } else {
                this.debugLog(`⚠️ Unhandled message type: ${data.type}`, 'WARN');
            }
        } catch (e) { 
            this.debugLog(`❌ Failed to parse WebSocket message: ${e.message}`, 'ERROR');
            try {
                ws.send(JSON.stringify({
                    type: MSG_TYPE_ERROR,
                    payload: { message: "消息格式错误" }
                }));
            } catch (sendError) {
                this.debugLog(`❌ Failed to send error response: ${sendError.message}`, 'ERROR');
            }
        }
    }

    async webSocketClose(ws, code, reason, wasClean) {
        const sessionId = ws.sessionId;
        const session = this.sessions.get(sessionId);
        
        if (session) {
            this.debugLog(`🔌 WebSocket disconnected for: ${session.username} (Session: ${sessionId}). Code: ${code}, Reason: ${reason}, WasClean: ${wasClean}`);
            
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
            this.debugLog(`🔌 WebSocket closing for unknown session (SessionId: ${sessionId}). Code: ${code}`);
        }
    }
    
    async webSocketError(ws, error) {
        const sessionId = ws.sessionId;
        const session = this.sessions.get(sessionId);
        const username = session ? session.username : 'unknown';
        
        this.debugLog(`💥 WebSocket error for ${username}: ${error}`, 'ERROR');
        
        // 触发关闭处理
        await this.webSocketClose(ws, 1011, "An error occurred", false);
    }

    // ============ 核心业务逻辑 ============
// In handleChatMessage function in chatroom_do.js:

async handleChatMessage(session, payload) {
    this.debugLog(`💬 Handling chat message from ${session.username}: ${payload.text?.substring(0, 50)}${payload.text?.length > 50 ? '...' : ''}`);
    
    // 确保状态已加载
    if (!this.isInitialized) {
        await this.loadState();
    }
    
    // 创建基本消息对象
    const message = {
        id: crypto.randomUUID(),
        username: session.username,
        timestamp: Date.now(),
        text: payload.text ? payload.text.trim() : '', // 确保文本不为null并去除首尾空格
        type: payload.type || 'text'
    };
    
    // 基于消息类型添加不同的字段
    if (payload.type === 'text') {
        // 文本消息验证
        if (!payload.text || payload.text.trim().length === 0) {
            this.debugLog(`❌ Empty message from ${session.username}`, 'WARN');
            return;
        }
        
        // 防止消息过长
        if (payload.text.length > 10000) {
            this.debugLog(`❌ Message too long from ${session.username}`, 'WARN');
            try {
                session.ws.send(JSON.stringify({
                    type: MSG_TYPE_ERROR,
                    payload: { message: "消息过长，请控制在10000字符以内" }
                }));
            } catch (e) {
                this.debugLog(`❌ Failed to send error message: ${e.message}`, 'ERROR');
            }
            return;
        }
        
        message.text = payload.text.trim();
    } 
    else if (payload.type === 'image') {
        // 图片消息
        if (!payload.imageUrl) {
            this.debugLog(`❌ Missing image URL from ${session.username}`, 'WARN');
            return;
        }
        
        message.imageUrl = payload.imageUrl;
        message.filename = payload.filename || '';
        message.size = payload.size || 0;
        
        // 可选的图片说明文字
        if (payload.caption) {
            message.caption = payload.caption.trim().substring(0, 500);
        }
        
        // 同时保存原始的text字段，以保持兼容性
        if (payload.text) {
            message.text = payload.text.trim().substring(0, 500);
        }
    }
    else if (payload.type === 'audio') {
        // 音频消息
        if (!payload.audioUrl) {
            this.debugLog(`❌ Missing audio URL from ${session.username}`, 'WARN');
            return;
        }
        
        message.audioUrl = payload.audioUrl;
        message.filename = payload.filename || '';
        message.size = payload.size || 0;
    }
    else {
        // 未知消息类型
        this.debugLog(`❌ Unknown message type: ${payload.type} from ${session.username}`, 'WARN');
        return;
    }
    
    // 保存消息
    this.messages.push(message);
    
    // 限制消息数量
    if (this.messages.length > 500) {
        this.messages.shift();
    }
    
    await this.saveState();
    
    this.debugLog(`📤 Broadcasting message to ${this.sessions.size} sessions`);
    this.broadcast({ type: MSG_TYPE_CHAT, payload: message });
}

    // ============ 辅助方法 ============
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
            const session = this.sessions.get(sessionId);
            if (session) {
                this.debugLog(`🧹 Cleaning up failed session: ${session.username}`);
                this.sessions.delete(sessionId);
            }
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