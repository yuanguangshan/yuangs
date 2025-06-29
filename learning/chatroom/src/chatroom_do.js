// src/chatroom_do.js

// 定义应用层协议的消息类型
const MSG_TYPE_CHAT = 'chat';
const MSG_TYPE_SYSTEM_STATE = 'system_state';
const MSG_TYPE_HISTORY = 'history';

export class ChatRoomDurableObject {
    constructor(state, env) {
        this.state = state;
        // `users` 用于存储所有连接到此聊天室的 WebSocket 会话
        // Map 的键是 WebSocket 对象，值是包含用户信息的对象
        this.users = new Map();
        // `messages` 用于存储聊天记录
        this.messages = [];
        // `lastSave` 用于实现对存储的节流写入
        this.lastSave = 0;

        // 异步初始化工作，加载历史聊天记录
        this.initializePromise = this.loadHistory();
    }

    // 从持久化存储中加载历史消息
    async loadHistory() {
        // 使用事务确保原子性
        await this.state.storage.transaction(async (txn) => {
            const storedMessages = await txn.get("messages");
            if (storedMessages) {
                this.messages = storedMessages;
            }
        });
    }

    // 安排一次节流的保存操作
    scheduleSave() {
        const now = Date.now();
        // 避免过于频繁的写入（例如，每5秒最多保存一次）
        if (now - this.lastSave > 5000) {
            this.lastSave = now;
            // 在后台执行保存，不阻塞当前请求
            this.state.waitUntil(this.saveHistory());
        }
    }

    // 将聊天记录完整地保存到持久化存储中
    async saveHistory() {
        try {
            await this.state.storage.transaction(async (txn) => {
                // 直接将消息数组序列化为 JSON 字符串进行存储
                await txn.put("messages", this.messages);
                console.log('Chat history saved to storage.');
            });
        } catch (error) {
            console.error('Failed to save chat history:', error);
        }
    }

    // Durable Object 的主入口点
    async fetch(request) {
        // 确保初始化完成
        await this.initializePromise;

        // 使用 blockConcurrencyWhile 保证所有操作串行执行，避免竞态条件
        return this.state.blockConcurrencyWhile(async () => {
            const upgradeHeader = request.headers.get("Upgrade");
            if (upgradeHeader !== "websocket") {
                return new Response("Expected Upgrade: websocket", { status: 426 });
            }

            // 从 URL 中获取用户名
            const url = new URL(request.url);
            const username = url.searchParams.get("username") || "Anonymous";

            // 创建 WebSocket 对
            const { 0: client, 1: server } = new WebSocketPair();
            
            // 处理新的 WebSocket 会话
            await this.handleSession(server, username);
            
            // 返回客户端 WebSocket，完成升级握手
            return new Response(null, {
                status: 101,
                webSocket: client
            });
        });
    }

    // 处理一个新的 WebSocket 连接会话
    async handleSession(ws, username) {
        ws.accept();

        // 存储会话信息
        const user = { ws, username };
        this.users.set(ws, user);

        // 1. 向新用户发送完整的聊天记录
        this.sendMessage(ws, {
            type: MSG_TYPE_HISTORY,
            payload: this.messages
        });

        // 2. 广播最新的系统状态（用户列表）给所有人
        this.broadcastSystemState();
        
        // 监听来自客户端的消息
        ws.addEventListener("message", (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === MSG_TYPE_CHAT) {
                    this.handleChatMessage(user, data.payload);
                }
            } catch (err) {
                console.error('Failed to handle message:', err);
            }
        });

        // 监听连接关闭事件
        ws.addEventListener("close", () => this.handleClose(ws));
        ws.addEventListener("error", () => this.handleClose(ws));
    }

    // 处理从客户端收到的聊天消息
    handleChatMessage(user, payload) {
        const message = {
            id: crypto.randomUUID(),
            username: user.username,
            text: payload.text,
            timestamp: Date.now(),
        };

        this.messages.push(message);
        // 限制内存中消息的数量，防止无限增长
        if (this.messages.length > 100) {
            this.messages.shift();
        }

        // 广播新消息给所有用户
        this.broadcast({
            type: MSG_TYPE_CHAT,
            payload: message
        });

        // 安排保存
        this.scheduleSave();
    }

    // 处理 WebSocket 连接关闭
    handleClose(ws) {
        if (this.users.has(ws)) {
            this.users.delete(ws);
            // 广播用户列表变更
            this.broadcastSystemState();
        }
    }

    // --- 消息发送辅助方法 ---

    // 发送单个消息的底层方法
    sendMessage(ws, message) {
        try {
            ws.send(JSON.stringify(message));
        } catch (err) {
            console.error('Failed to send message:', err);
            this.handleClose(ws);
        }
    }

    // 广播消息给所有连接的客户端
    broadcast(message) {
        this.users.forEach(user => {
            this.sendMessage(user.ws, message);
        });
    }

    // 广播最新的系统状态（如用户列表）
    broadcastSystemState() {
        const userList = Array.from(this.users.values()).map(u => u.username);
        this.broadcast({
            type: MSG_TYPE_SYSTEM_STATE,
            payload: {
                users: userList,
            }
        });
    }
}