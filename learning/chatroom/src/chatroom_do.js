// src/chatroom_do.js

// 定义应用层协议的消息类型
const MSG_TYPE_CHAT = 'chat';
const MSG_TYPE_DELETE = 'delete';
const MSG_TYPE_SYSTEM_STATE = 'system_state';
const MSG_TYPE_HISTORY = 'history';

export class ChatRoomDurableObject {
    constructor(state, env) {
        this.state = state;
        this.env = env;  // 添加 env 引用
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

    // 上传图片到 R2
    async uploadImageToR2(imageData, filename) {
        try {
            console.log('开始上传图片到 R2...', filename);
            
            // 从 base64 数据中提取实际的图片数据
            const base64Data = imageData.split(',')[1];
            if (!base64Data) {
                throw new Error('无效的图片数据');
            }
            
            const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            
            // 生成唯一文件名
            const timestamp = Date.now();
            const randomId = crypto.randomUUID();
            const fileExtension = filename.split('.').pop() || 'jpg';
            const key = `chat-images/${timestamp}-${randomId}.${fileExtension}`;

            console.log('上传文件路径:', key);

            // 上传到 R2
            const putResult = await this.env.R2_BUCKET.put(key, imageBuffer, {
                httpMetadata: {
                    contentType: this.getContentType(fileExtension),
                    cacheControl: 'public, max-age=31536000', // 缓存一年
                },
            });

            if (!putResult) {
                throw new Error('R2 上传返回空结果');
            }

            // 使用您的 R2 公开域名
            const imageUrl = `https://pub-8dfbdda6df204465aae771b4c080140b.r2.dev/${key}`;
            
            console.log('图片上传成功:', imageUrl);
            return imageUrl;
            
        } catch (error) {
            console.error('R2 上传失败:', error);
            throw new Error(`图片上传失败: ${error.message}`);
        }
    }

    // 获取文件的 Content-Type
    getContentType(extension) {
        const contentTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp'
        };
        return contentTypes[extension.toLowerCase()] || 'image/jpeg';
    }

    // 上传音频到 R2
    async uploadAudioToR2(audioData, filename, mimeType) {
        try {
            console.log('开始上传音频到 R2...', filename, mimeType);
            
            const base64Data = audioData.split(',')[1];
            if (!base64Data) {
                throw new Error('无效的音频数据');
            }
            
            const audioBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            
            const fileExtension = filename.split('.').pop() || 'bin';
            const key = `chat-audio/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

            console.log('上传文件路径:', key);

            await this.env.R2_BUCKET.put(key, audioBuffer, {
                httpMetadata: {
                    contentType: mimeType || 'application/octet-stream',
                    cacheControl: 'public, max-age=31536000',
                },
            });

            const audioUrl = `https://pub-8dfbdda6df204465aae771b4c080140b.r2.dev/${key}`;
            
            console.log('音频上传成功:', audioUrl);
            return audioUrl;
            
        } catch (error) {
            console.error('R2 音频上传失败:', error);
            throw new Error(`音频上传失败: ${error.message}`);
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
        ws.addEventListener("message", async (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === MSG_TYPE_CHAT) {
                    await this.handleChatMessage(user, data.payload);
                } else if (data.type === MSG_TYPE_DELETE) {
                    this.handleDeleteMessage(data.payload);
                }
            } catch (err) {
                console.error('Failed to handle message:', err);
                // 发送错误消息给客户端
                this.sendMessage(user.ws, {
                    type: 'error',
                    payload: { message: '消息处理失败' }
                });
            }
        });

        // 监听连接关闭事件
        ws.addEventListener("close", () => this.handleClose(ws));
        ws.addEventListener("error", () => this.handleClose(ws));
    }

    // 处理从客户端收到的聊天消息
    async handleChatMessage(user, payload) {
        let message = {
            id: crypto.randomUUID(),
            username: user.username,
            timestamp: Date.now(),
        };

        try {
            // 判断是文本消息还是图片消息
            if (payload.type === 'image') {
                console.log('处理图片消息:', payload.filename);
                
                // 上传图片到 R2
                const imageUrl = await this.uploadImageToR2(payload.image, payload.filename);
                
                message = {
                    ...message,
                    type: 'image',
                    imageUrl: imageUrl,
                    filename: payload.filename,
                    size: payload.size,
                    caption: payload.caption || ''
                };
                
                console.log('图片消息处理完成:', imageUrl);
            } else if (payload.type === 'audio') {
                console.log('处理音频消息:', payload.filename);
                
                const audioUrl = await this.uploadAudioToR2(payload.audio, payload.filename, payload.mimeType);
                
                message = {
                    ...message,
                    type: 'audio',
                    audioUrl: audioUrl,
                    filename: payload.filename,
                    size: payload.size,
                };
                
                console.log('音频消息处理完成:', audioUrl);
            } else {
                // 文本消息
                message.text = payload.text;
            }

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
            
        } catch (error) {
            console.error('处理聊天消息失败:', error);
            // 发送错误消息给发送者
            this.sendMessage(user.ws, {
                type: 'error',
                payload: { message: `消息发送失败: ${error.message}` }
            });
        }
    }

    // 处理从客户端收到的删除消息
    handleDeleteMessage(payload) {
        this.messages = this.messages.filter(m => m.id !== payload.id);

        // 广播删除消息给所有用户
        this.broadcast({
            type: MSG_TYPE_DELETE,
            payload: payload
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