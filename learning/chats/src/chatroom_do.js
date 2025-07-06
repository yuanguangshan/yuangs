// 文件: src/chatroom_do.js (带调试日志功能的版本)

import { DurableObject } from "cloudflare:workers";

const MSG_TYPE_CHAT = 'chat';
const MSG_TYPE_DELETE = 'delete';
const MSG_TYPE_ERROR = 'error';
const MSG_TYPE_WELCOME = 'welcome';
const MSG_TYPE_USER_JOIN = 'user_join';
const MSG_TYPE_USER_LEAVE = 'user_leave';
const MSG_TYPE_DEBUG_LOG = 'debug_log';

export class HibernatingChatRoom extends DurableObject {
    constructor(ctx, env) {
        super(ctx, env);
        this.ctx = ctx;
        this.env = env;
        this.messages = null;
        this.sessions = [];
        this.debugLogs = []; // 存储调试日志
        this.maxDebugLogs = 100; // 最多保存100条调试日志
        
        this.debugLog("🏗️ DO instance created.");
    }

    // 自定义调试日志方法
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
        
        // 实时广播调试日志给所有连接的会话
        this.broadcast({
            type: MSG_TYPE_DEBUG_LOG,
            payload: logEntry
        });
    }

    async loadState() {
        if (this.messages !== null) return;
        this.messages = (await this.ctx.storage.get("messages")) || [];
        this.debugLog(`📁 State loaded. Messages: ${this.messages.length}`);
    }

    async saveState() {
        if (this.messages === null) return;
        await this.ctx.storage.put("messages", this.messages);
        this.debugLog(`💾 State saved. Messages: ${this.messages.length}`);
    }

    // --- RPC Method for Cron ---
    async cronPost(text, secret) {
        if (this.env.CRON_SECRET && secret !== this.env.CRON_SECRET) {
            this.debugLog("CRON RPC: Unauthorized attempt!", 'ERROR');
            return;
        }
        this.debugLog(`🤖 Cron posting message: ${text}`);
        await this.handleChatMessage({ username: "小助手" }, { text, type: 'text' });
    }

    // --- Main Fetch Handler (入口点) ---
    async fetch(request) {
        const url = new URL(request.url);
        this.debugLog(`📥 Incoming request: ${request.method} ${url.pathname}`);

        // 处理 WebSocket 升级请求
        if (request.headers.get("Upgrade") === "websocket") {
            const { 0: client, 1: server } = new WebSocketPair();
            
            // 正确设置WebSocket事件处理器
            this.ctx.acceptWebSocket(server);
            
            // 将会话处理交给一个独立的函数
            await this.handleWebSocketSession(server, url);
            return new Response(null, { status: 101, webSocket: client });
        }
        
        // 处理所有 /api/ 请求
        if (url.pathname.startsWith('/api/')) {
            // API: 获取调试日志
            if (url.pathname.endsWith('/debug/logs')) {
                this.debugLog(`🔍 Debug logs requested. Total logs: ${this.debugLogs.length}`);
                return new Response(JSON.stringify({
                    logs: this.debugLogs,
                    totalLogs: this.debugLogs.length,
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
                    this.sessions = [];
                    this.debugLogs = []; // 也清空调试日志
                    this.debugLog("🔄 Room reset successfully");
                    return new Response("Room has been reset successfully.", { status: 200 });
                } else {
                    this.debugLog("🚫 Unauthorized reset attempt", 'WARN');
                    return new Response("Forbidden.", { status: 403 });
                }
            }
            
            // API: 获取历史消息
            if (url.pathname.endsWith('/messages/history')) {
                await this.loadState();
                const since = parseInt(url.searchParams.get('since') || '0', 10);
                const history = this.fetchHistory(since);
                this.debugLog(`📜 History requested. Since: ${since}, Returned: ${history.length} messages`);
                return new Response(JSON.stringify(history), {
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
            }
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

    // --- WebSocket 会话处理 ---
    async handleWebSocketSession(ws, url) {
        const username = decodeURIComponent(url.searchParams.get("username") || "Anonymous");
        
        // 直接将会话信息附加到 ws 对象上
        ws.session = { username }; 
        
        this.sessions.push(ws);

        this.debugLog(`✅ WebSocket connected for: ${username}. Total sessions: ${this.sessions.length}`);

        // 发送欢迎消息，包含历史记录
        await this.loadState();
        ws.send(JSON.stringify({
            type: MSG_TYPE_WELCOME,
            payload: {
                message: `欢迎 ${username} 加入!`,
                history: this.messages.slice(-50)
            }
        }));

        this.broadcast({ type: MSG_TYPE_USER_JOIN, payload: { username } }, ws);
    }

    // --- WebSocket 事件处理器 ---
    async webSocketMessage(ws, message) {
        const username = ws.session?.username || 'unknown';
        this.debugLog(`📨 Received WebSocket message from ${username}: ${message}`);
        
        const session = ws.session;
        if (!session) {
            this.debugLog("❌ No session found for WebSocket", 'ERROR');
            return;
        }

        try {
            const data = JSON.parse(message);
            this.debugLog(`📋 Parsed message data: ${JSON.stringify(data)}`);
            
            if (data.type === MSG_TYPE_CHAT) {
                // 将 session 和 ws 组合成 user 对象传下去
                await this.handleChatMessage({ ws, ...session }, data.payload);
            } else {
                this.debugLog(`⚠️ Unhandled message type: ${data.type}`, 'WARN');
            }
        } catch (e) { 
            this.debugLog(`❌ Failed to parse WebSocket message: ${e.message}`, 'ERROR');
            ws.send(JSON.stringify({
                type: MSG_TYPE_ERROR,
                payload: { message: "Invalid message format" }
            }));
        }
    }

    async webSocketClose(ws, code, reason, wasClean) {
        this.debugLog(`🔌 WebSocket closing. Code: ${code}, Reason: ${reason}, WasClean: ${wasClean}`);
        
        const index = this.sessions.findIndex(s => s === ws);
        if (index > -1) {
            const sessionWs = this.sessions.splice(index, 1)[0];
            const username = sessionWs.session?.username || '未知用户';
            this.debugLog(`🔌 WebSocket disconnected for: ${username}. Remaining sessions: ${this.sessions.length}`);
            this.broadcast({ type: MSG_TYPE_USER_LEAVE, payload: { username } });
        }
    }
    
    async webSocketError(ws, error) {
        this.debugLog(`💥 WebSocket error: ${error}`, 'ERROR');
        this.webSocketClose(ws, 1011, "An error occurred", false);
    }

    // --- 核心业务逻辑 ---
    async handleChatMessage(session, payload) {
        this.debugLog(`💬 Handling chat message from ${session.username}: ${payload.text}`);
        
        await this.loadState();
        const message = {
            id: crypto.randomUUID(),
            username: session.username,
            timestamp: Date.now(),
            text: payload.text,
            type: 'text'
        };
        this.messages.push(message);
        if (this.messages.length > 200) this.messages.shift();
        
        await this.saveState();
        this.debugLog(`📤 Broadcasting message to ${this.sessions.length} sessions`);
        this.broadcast({ type: MSG_TYPE_CHAT, payload: message });
    }

    // --- 辅助方法 ---
    fetchHistory(since = 0) {
        return since > 0 ? this.messages.filter(msg => msg.timestamp > since) : this.messages;
    }

    broadcast(message, excludeWs = null) {
        const stringifiedMessage = JSON.stringify(message);
        let activeSessions = 0;
        
        this.sessions = this.sessions.filter(ws => {
            if (ws === excludeWs) {
                return true;
            }
            try {
                ws.send(stringifiedMessage);
                activeSessions++;
                return true;
            } catch (e) {
                this.debugLog(`💥 Failed to send message to session: ${e.message}`, 'ERROR');
                return false;
            }
        });
        
        // 避免调试日志的广播产生无限循环
        if (message.type !== MSG_TYPE_DEBUG_LOG) {
            this.debugLog(`📡 Message broadcast to ${activeSessions} active sessions`);
        }
    }
}