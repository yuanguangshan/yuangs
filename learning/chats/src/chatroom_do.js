// 文件: src/chatroom_do.js (Final Refactored RPC Version)

import { DurableObject } from "cloudflare:workers";

const MSG_TYPE_CHAT = 'chat', MSG_TYPE_DELETE = 'delete', MSG_TYPE_ERROR = 'error';
const MSG_TYPE_WELCOME = 'welcome', MSG_TYPE_USER_JOIN = 'user_join', MSG_TYPE_USER_LEAVE = 'user_leave';

export class HibernatingChatRoom extends DurableObject {
    constructor(ctx, env) {
        super(ctx, env);
        this.ctx = ctx;
        this.env = env;
        this.messages = null;
        // 【核心修正】我们自己来管理会话，不再依赖 getWebSockets()
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
    

    async cronPost(text, secret) {
        if (this.env.CRON_SECRET && secret !== this.env.CRON_SECRET) {
            console.error("CRON RPC: Unauthorized attempt!");
            return;
        }
        await this.loadState();
        console.log(`CRON RPC: Received post. Current messages: ${this.messages.length}`);
        await this.handleChatMessage({ username: "小助手" }, { text, type: 'text' });
        console.log(`CRON RPC: Post processed. New message count: ${this.messages.length}`);
    }


    // 主 fetch 方法
    async fetch(request) {
        const url = new URL(request.url);

        if (request.headers.get("Upgrade") === "websocket") {
            const { 0: client, 1: server } = new WebSocketPair();
            await this.handleWebSocketSession(server, url);
            return new Response(null, { status: 101, webSocket: client });
        }
        
        // reset-room 和 history API)
        // API: 重置房间
        if (url.pathname.endsWith('/api/reset-room')) {
            const secret = url.searchParams.get('secret');
            if (this.env.ADMIN_SECRET && secret === this.env.ADMIN_SECRET) {
                await this.ctx.storage.deleteAll();
                this.messages = []; 
                this.userStats = new Map();
                return new Response("Room has been reset successfully.", { status: 200 });
            } else {
                return new Response("Forbidden.", { status: 403 });
            }
        }
        
        // API: 获取历史消息
        if (url.pathname.endsWith('/api/messages/history')) {
            await this.loadState();
            const since = parseInt(url.searchParams.get('since') || '0', 10);
            const history = this.fetchHistory(since);
            return new Response(JSON.stringify(history), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }
        return new Response("Not Found", { status: 404 });
    }
  // 【全新】独立的 WebSocket 会话处理函数
    async handleWebSocketSession(ws, url) {
        ws.accept();
        const username = url.searchParams.get("username") || "Anonymous";
        const session = { ws, username };
        this.sessions.push(session);

        // 发送欢迎消息
        await this.loadState();
        ws.send(JSON.stringify({
            type: MSG_TYPE_WELCOME,
            payload: {
                message: `欢迎 ${username} 加入!`,
                history: this.messages.slice(-50)
            }
        }));

        this.broadcast({ type: MSG_TYPE_USER_JOIN, payload: { username } });
    }

    // --- WebSocket Event Handlers ---
    async webSocketMessage(ws, message) {
        const session = this.sessions.find(s => s.ws === ws);
        if (!session) return;

        try {
            const data = JSON.parse(message);
            if (data.type === MSG_TYPE_CHAT) {
                await this.handleChatMessage(session, data.payload);
            }
        } catch (e) { /* 忽略错误 */ }
    }

    async webSocketClose(ws, code, reason, wasClean) {
        const index = this.sessions.findIndex(s => s.ws === ws);
        if (index > -1) {
            const session = this.sessions.splice(index, 1)[0];
            this.broadcast({ type: MSG_TYPE_USER_LEAVE, payload: { username: session.username } });
        }
    }

    async webSocketError(ws, error) {
        this.webSocketClose(ws, 1011, "An error occurred");
    }

    // --- Core Logic & Handlers ---
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

    // 【核心修正】广播方法，遍历我们自己管理的 sessions 数组
    broadcast(message) {
        const stringifiedMessage = JSON.stringify(message);
        // 清理已关闭的连接，并发送消息
        this.sessions = this.sessions.filter(session => {
            try {
                session.ws.send(stringifiedMessage);
                return true; // 连接有效，保留
            } catch (e) {
                return false; // 连接已关闭，从数组中移除
            }
        });
    }
}