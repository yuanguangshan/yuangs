// src/document_do.js

import * as Y from 'yjs';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import {
    Awareness,
    applyAwarenessUpdate,
    removeAwarenessStates
} from 'y-protocols/awareness.js';
import {
    readSyncMessage,
    writeSyncStep1,
    writeUpdate,
    writeSyncStep2,
} from 'y-protocols/sync.js';

// 定义消息类型常量，与 y-websocket 客户端保持一致
const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;

// 定义 WebSocket 关闭代码
const CLOSE_REASON_DUPLICATE_CONNECTION = 4001;

export class DocumentDurableObject {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.sessions = new Map(); // 存储 WebSocket 会话
        this.ydoc = null; // Y.Doc 实例
        this.awareness = null; // Awareness 实例
        this.lastSave = 0; // 上次保存到持久化存储的时间戳

        // 初始化 Promise，确保在处理任何请求前，Y.Doc 已从存储中加载完毕
        this.initializePromise = this.loadYDoc();
    }

    // 从持久化存储中加载 Y.Doc
    async loadYDoc() {
        // 使用事务确保原子性
        await this.state.storage.transaction(async (txn) => {
            // 从键 "ydoc" 中获取存储的文档状态
            const storedYDoc = await txn.get("ydoc");

            // 创建 Y.Doc 实例
            this.ydoc = new Y.Doc();
            // 创建 Awareness 实例
            this.awareness = new Awareness(this.ydoc);

            // 如果存在已存储的文档，则应用更新
            if (storedYDoc) {
                Y.applyUpdate(this.ydoc, new Uint8Array(storedYDoc));
            }

            // 监听 Y.Doc 的更新事件
            this.ydoc.on('update', (update, origin) => {
                // 将更新广播给所有连接的客户端
                this.broadcast(update, origin);
                // 触发保存操作
                this.scheduleSave();
            });

            // 监听 Awareness 的更新事件
            this.awareness.on('update', (update, origin) => {
                // 将 Awareness 更新广播给所有连接的客户端
                this.broadcastAwareness(update, origin);
            });
        });
    }

    // 安排 Y.Doc 的保存操作，使用节流防止频繁写入
    scheduleSave() {
        const now = Date.now();
        // 每隔 2 秒最多保存一次
        if (now - this.lastSave > 2000) {
            this.lastSave = now;
            // 在后台执行保存，不阻塞当前操作
            this.state.waitUntil(this.saveYDoc());
        }
    }

    // 将 Y.Doc 的状态保存到持久化存储
    async saveYDoc() {
        // 使用事务确保写入的原子性
        await this.state.storage.transaction(async (txn) => {
            // 将 Y.Doc 编码为二进制格式并存储
            const docState = Y.encodeStateAsUpdate(this.ydoc);
            await txn.put("ydoc", docState);
        });
    }

    // 处理传入的请求 (HTTP / WebSocket)
    async fetch(request) {
        // 确保 Y.Doc 初始化完成
        await this.initializePromise;

        // 使用 blockConcurrencyWhile 保证所有操作的串行执行，避免竞态条件
        return this.state.blockConcurrencyWhile(async () => {
            const url = new URL(request.url);

            if (url.pathname === "/websocket") {
                // 处理 WebSocket 升级请求
                const upgradeHeader = request.headers.get("Upgrade");
                if (!upgradeHeader || upgradeHeader !== "websocket") {
                    return new Response("Expected Upgrade: websocket", {
                        status: 426
                    });
                }

                const {
                    0: client,
                    1: server
                } = new WebSocketPair();
                await this.handleSession(server);

                return new Response(null, {
                    status: 101,
                    webSocket: client
                });
            }

            return new Response("Not Found", {
                status: 404
            });
        });
    }

    // 处理单个 WebSocket 会话
    async handleSession(ws) {
        ws.accept();

        // 创建会话对象
        const session = {
            ws,
            awareness: new Set(),
        };
        this.sessions.set(ws, session);

        // --- 发送初始同步数据 ---
        // 1. 发送 Sync Step 1
        const syncStep1 = writeSyncStep1(this.ydoc);
        this.sendMessage(ws, syncStep1);

        // 2. 发送 Sync Step 2 (如果文档已有内容)
        if (this.ydoc.share.size > 0) {
            const syncStep2 = writeSyncStep2(this.ydoc);
            this.sendMessage(ws, syncStep2);
        }

        // 3. 发送当前 Awareness 状态
        const awarenessStates = this.awareness.getStates();
        if (awarenessStates.size > 0) {
            const awarenessUpdate = Y.encodeAwarenessUpdate(this.awareness, Array.from(awarenessStates.keys()));
            this.sendAwareness(ws, awarenessUpdate);
        }

        // 监听来自客户端的消息
        ws.addEventListener("message", (event) => {
            try {
                const message = new Uint8Array(event.data);
                this.handleMessage(ws, message);
            } catch (err) {
                console.error("Failed to handle message:", err);
                ws.close(1011, "Error handling message");
            }
        });

        // 监听关闭事件
        ws.addEventListener("close", () => {
            this.handleClose(ws);
        });

        // 监听错误事件
        ws.addEventListener("error", (err) => {
            console.error("WebSocket error:", err);
            this.handleClose(ws);
        });
    }

    // 处理来自客户端的 Y.js 消息
    handleMessage(ws, message) {
        const session = this.sessions.get(ws);
        if (!session) return;

        const decoder = new decoding.createDecoder(message);
        const messageType = decoding.readVarUint(decoder);

        switch (messageType) {
            case MESSAGE_SYNC: {
                const syncMessage = readSyncMessage(decoder, this.ydoc);
                // 将客户端的更新应用到服务端的 Y.Doc
                Y.applyUpdate(this.ydoc, syncMessage, ws);
                break;
            }
            case MESSAGE_AWARENESS: {
                const awarenessUpdate = decoding.readVarUint8Array(decoder);
                // 将客户端的 Awareness 更新应用到服务端的 Awareness 实例
                applyAwarenessUpdate(this.awareness, awarenessUpdate, ws);
                break;
            }
            default:
                console.warn("Unknown message type:", messageType);
        }
    }

    // 处理 WebSocket 连接关闭
    handleClose(ws) {
        const session = this.sessions.get(ws);
        if (!session) return;

        // 从 Awareness 中移除该会话的状态
        removeAwarenessStates(this.awareness, Array.from(session.awareness), ws);
        // 从会话列表中删除
        this.sessions.delete(ws);
    }

    // 向单个 WebSocket 发送 Y.js 消息
    sendMessage(ws, message) {
        try {
            ws.send(message);
        } catch (err) {
            console.error("Failed to send message:", err);
            this.handleClose(ws);
        }
    }

    // 向单个 WebSocket 发送 Awareness 消息
    sendAwareness(ws, message) {
        const envelope = new encoding.createEncoder();
        encoding.writeVarUint(envelope, MESSAGE_AWARENESS);
        encoding.writeVarUint8Array(envelope, message);
        this.sendMessage(ws, encoding.toUint8Array(envelope));
    }

    // 广播 Y.Doc 更新给所有客户端
    broadcast(update, origin) {
        const envelope = new encoding.createEncoder();
        encoding.writeVarUint(envelope, MESSAGE_SYNC);
        writeUpdate(envelope, update);
        const message = encoding.toUint8Array(envelope);

        this.sessions.forEach((session, ws) => {
            // 不把消息发回给源头
            if (ws !== origin) {
                this.sendMessage(ws, message);
            }
        });
    }

    // 广播 Awareness 更新给所有客户端
    broadcastAwareness(update, origin) {
        const envelope = new encoding.createEncoder();
        encoding.writeVarUint(envelope, MESSAGE_AWARENESS);
        encoding.writeVarUint8Array(envelope, update);
        const message = encoding.toUint8Array(envelope);

        this.sessions.forEach((session, ws) => {
            // 不把消息发回给源头
            if (ws !== origin) {
                this.sendMessage(ws, message);
            }
        });
    }
}