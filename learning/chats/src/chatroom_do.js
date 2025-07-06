// 文件: src/chatroom_do.js (修复版本)

import { DurableObject } from "cloudflare:workers";

const MSG_TYPE_CHAT = 'chat';
const MSG_TYPE_DELETE = 'delete';
const MSG_TYPE_ERROR = 'error';
const MSG_TYPE_WELCOME = 'welcome';
const MSG_TYPE_USER_JOIN = 'user_join';
const MSG_TYPE_USER_LEAVE = 'user_leave';

export class HibernatingChatRoom extends DurableObject {
    constructor(ctx, env) {
        super(ctx, env);
        this.ctx = ctx;
        this.env = env;
        this.messages = null;
        this.sessions = [];
        console.log("🏗️ DO instance created.");
    }

    async loadState() {
        if (this.messages !== null) return;
        this.messages = (await this.ctx.storage.get("messages")) || [];
        console.log(`📁 State loaded. Messages: ${this.messages.length}`);
    }

    async saveState() {
        if (this.messages === null) return;
        await this.ctx.storage.put("messages", this.messages);
        console.log(`💾 State saved. Messages: ${this.messages.length}`);
    }

    // --- RPC Method for Cron ---
    async cronPost(text, secret) {
        if (this.env.CRON_SECRET && secret !== this.env.CRON_SECRET) {
            console.error("CRON RPC: Unauthorized attempt!");
            return;
        }
        await this.handleChatMessage({ username: "小助手" }, { text, type: 'text' });
    }

    // --- Main Fetch Handler (入口点) ---
    async fetch(request) {
        const url = new URL(request.url);

        // 处理 WebSocket 升级请求
        if (request.headers.get("Upgrade") === "websocket") {
            const { 0: client, 1: server } = new WebSocketPair();
            
            // 【关键修复】正确设置WebSocket事件处理器
            this.ctx.acceptWebSocket(server);
            
            // 将会话处理交给一个独立的函数
            await this.handleWebSocketSession(server, url);
            return new Response(null, { status: 101, webSocket: client });
        }
        
        // 处理所有 /api/ 请求
        if (url.pathname.startsWith('/api/')) {
            // API: 重置房间
            if (url.pathname.endsWith('/reset-room')) {
                const secret = url.searchParams.get('secret');
                if (this.env.ADMIN_SECRET && secret === this.env.ADMIN_SECRET) {
                    await this.ctx.storage.deleteAll();
                    this.messages = [];
                    this.sessions = [];
                    console.log("🔄 Room reset successfully");
                    return new Response("Room has been reset successfully.", { status: 200 });
                } else {
                    return new Response("Forbidden.", { status: 403 });
                }
            }
            // API: 获取历史消息
            if (url.pathname.endsWith('/messages/history')) {
                await this.loadState();
                const since = parseInt(url.searchParams.get('since') || '0', 10);
                const history = this.fetchHistory(since);
                return new Response(JSON.stringify(history), {
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
            }
        }

        // 处理所有其他 GET 请求（例如页面加载）
        if (request.method === "GET") {
            return new Response(null, {
                headers: { "X-DO-Request-HTML": "true" },
            });
        }

        return new Response("Not Found", { status: 404 });
    }

    // --- WebSocket 会话处理 ---
    async handleWebSocketSession(ws, url) {
        const username = decodeURIComponent(url.searchParams.get("username") || "Anonymous");
        
        // 直接将会话信息附加到 ws 对象上
        ws.session = { username }; 
        
        this.sessions.push(ws);

        console.log(`✅ WebSocket connected for: ${username}`);

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

    // --- 【关键修复】WebSocket 事件处理器 ---
    async webSocketMessage(ws, message) {
        console.log(`📨 Received WebSocket message from ${ws.session?.username || 'unknown'}: ${message}`);
        
        const session = ws.session;
        if (!session) {
            console.error("❌ No session found for WebSocket");
            return;
        }

        try {
            const data = JSON.parse(message);
            console.log(`📋 Parsed message data:`, data);
            
            if (data.type === MSG_TYPE_CHAT) {
                // 将 session 和 ws 组合成 user 对象传下去
                await this.handleChatMessage({ ws, ...session }, data.payload);
            } else {
                console.log(`⚠️ Unhandled message type: ${data.type}`);
            }
        } catch (e) { 
            console.error("❌ Failed to parse WebSocket message:", e);
            ws.send(JSON.stringify({
                type: MSG_TYPE_ERROR,
                payload: { message: "Invalid message format" }
            }));
        }
    }

    async webSocketClose(ws, code, reason, wasClean) {
        console.log(`🔌 WebSocket closing. Code: ${code}, Reason: ${reason}, WasClean: ${wasClean}`);
        
        const index = this.sessions.findIndex(s => s === ws);
        if (index > -1) {
            const sessionWs = this.sessions.splice(index, 1)[0];
            const username = sessionWs.session?.username || '未知用户';
            console.log(`🔌 WebSocket disconnected for: ${username}`);
            this.broadcast({ type: MSG_TYPE_USER_LEAVE, payload: { username } });
        }
    }
    
    async webSocketError(ws, error) {
        console.error("💥 WebSocket error:", error);
        this.webSocketClose(ws, 1011, "An error occurred", false);
    }

    // --- 核心业务逻辑 ---
    async handleChatMessage(session, payload) {
        console.log(`💬 Handling chat message from ${session.username}: ${payload.text}`);
        
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
        console.log(`📤 Broadcasting message to ${this.sessions.length} sessions`);
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
                console.error(`💥 Failed to send message to session:`, e);
                return false;
            }
        });
        
        console.log(`📡 Message broadcast to ${activeSessions} active sessions`);
    }
}