// 文件: src/chatroom_do.js (Final, Full-Featured, and Correct Version)

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
            // 将会话处理交给一个独立的函数
            await this.handleWebSocketSession(server, url);
            return new Response(null, { status: 101, webSocket: client });
        }
        
        // 【已补回】处理所有 /api/ 请求
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
        ws.accept();
        const username = decodeURIComponent(url.searchParams.get("username") || "Anonymous");
        const session = { ws, username };
        this.sessions.push(session);

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

        this.broadcast({ type: MSG_TYPE_USER_JOIN, payload: { username } }, session);
    }

    // --- WebSocket 事件处理器 ---
    async webSocketMessage(ws, message) {
        const session = this.sessions.find(s => s.ws === ws);
        if (!session) return;

        try {
            const data = JSON.parse(message);
            if (data.type === MSG_TYPE_CHAT) {
                await this.handleChatMessage(session, data.payload);
            }
            // (可以从旧代码中添加其他消息类型的处理，如 delete, rename, rtc 等)
        } catch (e) { 
            console.error("Failed to parse WebSocket message:", e);
        }
    }

    async webSocketClose(ws, code, reason, wasClean) {
        const index = this.sessions.findIndex(s => s.ws === ws);
        if (index > -1) {
            const session = this.sessions.splice(index, 1)[0];
            console.log(`🔌 WebSocket disconnected for: ${session.username}`);
            this.broadcast({ type: MSG_TYPE_USER_LEAVE, payload: { username: session.username } });
        }
    }
    
    async webSocketError(ws, error) {
        console.error("WebSocket error:", error);
        this.webSocketClose(ws, 1011, "An error occurred");
    }

    // --- 核心业务逻辑 ---
    async handleChatMessage(session, payload) {
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
        this.broadcast({ type: MSG_TYPE_CHAT, payload: message });
    }

    // --- 辅助方法 ---
    fetchHistory(since = 0) {
        return since > 0 ? this.messages.filter(msg => msg.timestamp > since) : this.messages;
    }

    broadcast(message, excludeSession = null) {
        const stringifiedMessage = JSON.stringify(message);
        // 遍历所有会话，并排除掉 `excludeSession` (如果提供了)
        this.sessions = this.sessions.filter(session => {
            if (session === excludeSession) {
                return true; // 保留被排除的会话
            }
            try {
                session.ws.send(stringifiedMessage);
                return true; // 连接有效，保留
            } catch (e) {
                return false; // 连接已关闭，从数组中移除
            }
        });
    }
}