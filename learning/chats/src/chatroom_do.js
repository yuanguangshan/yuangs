// 文件: src/chatroom_do.js (Final, Correct, and Syntactically-Valid RPC Version)

import { DurableObject } from "cloudflare:workers";

const MSG_TYPE_CHAT = 'chat', MSG_TYPE_DELETE = 'delete', MSG_TYPE_ERROR = 'error', MSG_TYPE_RENAME = 'rename';
const MSG_TYPE_OFFER = 'offer', MSG_TYPE_ANSWER = 'answer', MSG_TYPE_CANDIDATE = 'candidate', MSG_TYPE_CALL_END = 'call_end';

export class HibernatingChatRoom extends DurableObject {
    constructor(ctx, env) {
        super(ctx, env);
        this.ctx = ctx;
        this.env = env;
        this.messages = null;
        this.userStats = null;
    }

    async loadState() {
        if (this.messages !== null) return;
        const storedStats = await this.ctx.storage.get("userStats");
        this.userStats = storedStats ? new Map(storedStats) : new Map();
        this.messages = (await this.ctx.storage.get("messages")) || [];
        console.log(`DO State: Loaded. Messages: ${this.messages.length}, Users: ${this.userStats.size}`);
    }

    async saveState() {
        if (this.messages === null || this.userStats === null) return;
        await this.ctx.storage.put({
            messages: this.messages,
            userStats: Array.from(this.userStats.entries()),
        });
        console.log(`DO State: Saved. Messages: ${this.messages.length}`);
    }

    async cronPost(text, secret) {
        if (this.env.CRON_SECRET && secret !== this.env.CRON_SECRET) {
            return;
        }
        await this.loadState();
        await this.handleChatMessage({ username: "小助手" }, { text, type: 'text' });
    }

    async fetch(request) {
        try {
            const url = new URL(request.url);

            if (url.pathname.endsWith('/api/reset-room')) {
                const secret = url.searchParams.get('secret');
                if (this.env.ADMIN_SECRET && secret === this.env.ADMIN_SECRET) {
                    await this.ctx.storage.deleteAll();
                    this.messages = []; this.userStats = new Map();
                    return new Response("Room has been reset successfully.", { status: 200 });
                } else {
                    return new Response("Forbidden.", { status: 403 });
                }
            }
            
            if (url.pathname.endsWith('/api/messages/history')) {
                await this.loadState();
                const since = parseInt(url.searchParams.get('since') || '0', 10);
                return new Response(JSON.stringify(this.fetchHistory(since)), {
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
            }
            
            if (request.headers.get("Upgrade") === "websocket") {
                const username = url.searchParams.get("username") || "Anonymous";
                const { 0: client, 1: server } = new WebSocketPair();
                server.accept();
                this.ctx.getWebSockets(username).push(server);
                return new Response(null, { status: 101, webSocket: client });
            }

            if (request.method === 'GET') {
                return new Response(null, { headers: { 'X-DO-Request-HTML': 'true' } });
            }

            return new Response("Not Found", { status: 404 });
        } catch (error) {
            if (error.message.includes("upgraded")) {
                return new Response("Server script has been upgraded. Please reconnect.", { status: 426 });
            }
            console.error("Critical error in DO fetch:", error);
            return new Response("Internal Server Error", { status: 500 });
        }
    }
    
    async webSocketOpen(ws) {
        const tags = ws.getTags();
        console.log(`DO: WebSocket opened for tags: ${JSON.stringify(tags)}`);
    }

    async webSocketMessage(ws, message) {
        await this.loadState();
        const username = (ws.getTags()[0] || 'Anonymous');
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
                    console.warn(`DO: Unknown message type received: ${data.type}`);
            }
        } catch (err) {
            this.sendMessage(ws, { type: MSG_TYPE_ERROR, payload: { message: '消息处理失败' } });
            console.error('DO: Failed to handle message:', err);
        }
    }

    async webSocketClose(ws, code, reason, wasClean) {
        console.log(`DO: WebSocket closed for tags: ${JSON.stringify(ws.getTags())}. Code: ${code}, Reason: "${reason}", Clean: ${wasClean}`);
    }
    
    async webSocketError(ws, error) {
        console.error(`DO: WebSocket error for tags: ${JSON.stringify(ws.getTags())}:`, error);
    }

    async handleChatMessage(user, payload) {
        const messageType = payload.type || 'text';
        let message;
        if (messageType === 'image') message = await this.createImageMessage(user, payload);
        else if (messageType === 'audio') message = await this.createAudioMessage(user, payload);
        else message = this.createTextMessage(user, payload);
        this.messages.push(message);
        if (this.messages.length > 200) this.messages.shift();
        this.updateUserStatsOnMessage(user.username);
        this.broadcast({ type: MSG_TYPE_CHAT, payload: message });
        await this.saveState();
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
    fetchHistory(since = 0) { return since > 0 ? this.messages.filter(msg => msg.timestamp > since) : this.messages; }
    updateUserStatsOnMessage(username) { const stats = this.userStats.get(username) || { messageCount: 0 }; stats.messageCount++; this.userStats.set(username, stats); }
    createTextMessage(user, payload) { return { id: crypto.randomUUID(), username: user.username, timestamp: Date.now(), text: payload.text, type: 'text' }; }
    async createImageMessage(user, payload) { const imageUrl = await this.uploadToR2(payload.image, payload.filename, 'image'); return { id: crypto.randomUUID(), username: user.username, timestamp: Date.now(), type: 'image', imageUrl, filename: payload.filename, size: payload.size, caption: payload.caption }; }
    async createAudioMessage(user, payload) { const audioUrl = await this.uploadToR2(payload.audio, payload.filename, 'audio', payload.mimeType); return { id: crypto.randomUUID(), username: user.username, timestamp: Date.now(), type: 'audio', audioUrl, filename: payload.filename, size: payload.size, mimeType: payload.mimeType }; }
    async uploadToR2(data, filename, type, mimeType) { const base64Data = data.split(',')[1]; if (!base64Data) throw new Error("Invalid base64 data"); const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)); const key = `chat-${type}s/${Date.now()}-${crypto.randomUUID()}.${filename.split('.').pop()||'bin'}`; await this.env.R2_BUCKET.put(key, buffer, { httpMetadata: { contentType: mimeType || 'application/octet-stream' }}); return `https://pub-8dfbdda6df204465aae771b4c080140b.r2.dev/${key}`; }
    
    forwardRtcSignal(type, fromUser, payload) {
        for (const targetWs of this.ctx.getWebSockets(payload.target)) {
            this.sendMessage(targetWs, { type, payload: { from: fromUser.username, ...payload } });
        }
    }

    sendMessage(ws, message) { try { ws.send(JSON.stringify(message)); } catch (e) {} }

    broadcast(message) {
        for (const ws of this.ctx.getWebSockets()) {
            this.sendMessage(ws, message);
        }
    }
}