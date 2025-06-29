// src/document_do.js

import * as Y from 'yjs';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import {
    Awareness,
    applyAwarenessUpdate,
    removeAwarenessStates,
    encodeAwarenessUpdate
} from 'y-protocols/awareness.js';
import {
    readSyncMessage,
    writeSyncStep1,
    writeUpdate,
    writeSyncStep2,
} from 'y-protocols/sync.js';

// 定义消息类型常量
const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;

export class DocumentDurableObject {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.sessions = new Map();
        this.ydoc = null;
        this.awareness = null;
        this.lastSave = 0;

        this.initializePromise = this.loadYDoc();
    }

    async loadYDoc() {
        await this.state.storage.transaction(async (txn) => {
            const storedYDoc = await txn.get("ydoc");

            this.ydoc = new Y.Doc();
            this.awareness = new Awareness(this.ydoc);

            if (storedYDoc) {
                Y.applyUpdate(this.ydoc, new Uint8Array(storedYDoc));
            }

            this.ydoc.on('update', (update, origin) => {
                this.broadcast(update, origin);
                this.scheduleSave();
            });

            this.awareness.on('update', ({ added, updated, removed }, origin) => {
                const changedClients = added.concat(updated, removed);
                if (changedClients.length > 0) {
                    const update = encodeAwarenessUpdate(this.awareness, changedClients);
                    this.broadcastAwareness(update, origin);
                }
            });
        });
    }

    scheduleSave() {
        const now = Date.now();
        if (now - this.lastSave > 2000) {
            this.lastSave = now;
            this.state.waitUntil(this.saveYDoc());
        }
    }

    async saveYDoc() {
        await this.state.storage.transaction(async (txn) => {
            const docState = Y.encodeStateAsUpdate(this.ydoc);
            await txn.put("ydoc", docState);
        });
    }

    async fetch(request) {
        await this.initializePromise;

        return this.state.blockConcurrencyWhile(async () => {
            const url = new URL(request.url);
            const upgradeHeader = request.headers.get("Upgrade");
            if (upgradeHeader === "websocket") {
                if (!upgradeHeader || upgradeHeader !== "websocket") {
                    return new Response("Expected Upgrade: websocket", {
                        status: 426
                    });
                }

                const { 0: client, 1: server } = new WebSocketPair();
                await this.handleSession(server);

                return new Response(null, {
                    status: 101,
                    webSocket: client
                });
            }

            return new Response("Not Found", { status: 404 });
        });
    }

    async handleSession(ws) {
        ws.accept();

        const session = {
            ws,
            awareness: new Set(),
        };
        this.sessions.set(ws, session);

        // 发送初始同步数据
        // 1. 发送 Sync Step 1
        const encoder1 = encoding.createEncoder();
        encoding.writeVarUint(encoder1, MESSAGE_SYNC);
        writeSyncStep1(encoder1, this.ydoc);
        this.sendMessage(ws, encoding.toUint8Array(encoder1));

        // 2. 发送当前 Awareness 状态
        const awarenessStates = this.awareness.getStates();
        if (awarenessStates.size > 0) {
            const awarenessUpdate = encodeAwarenessUpdate(this.awareness, Array.from(awarenessStates.keys()));
            this.sendAwareness(ws, awarenessUpdate);
        }

        // 监听消息
        ws.addEventListener("message", (event) => {
            try {
                const message = new Uint8Array(event.data);
                this.handleMessage(ws, message);
            } catch (err) {
                console.error("Failed to handle message:", err);
                ws.close(1011, "Error handling message");
            }
        });

        // 监听关闭和错误事件
        ws.addEventListener("close", () => this.handleClose(ws));
        ws.addEventListener("error", (err) => {
            console.error("WebSocket error:", err);
            this.handleClose(ws);
        });
    }

    handleMessage(ws, message) {
        const session = this.sessions.get(ws);
        if (!session) return;

        const decoder = decoding.createDecoder(message);
        const messageType = decoding.readVarUint(decoder);

        switch (messageType) {
            case MESSAGE_SYNC: {
                const encoder = encoding.createEncoder();
                encoding.writeVarUint(encoder, MESSAGE_SYNC);
                readSyncMessage(decoder, encoder, this.ydoc, ws);
                
                const response = encoding.toUint8Array(encoder);
                if (response.length > 1) {
                    this.sendMessage(ws, response);
                }
                break;
            }
            case MESSAGE_AWARENESS: {
                const awarenessUpdate = decoding.readVarUint8Array(decoder);
                applyAwarenessUpdate(this.awareness, awarenessUpdate, ws);
                break;
            }
            default:
                console.warn("Unknown message type:", messageType);
        }
    }

    handleClose(ws) {
        const session = this.sessions.get(ws);
        if (!session) return;

        // 从 Awareness 中移除该会话的状态
        const awarenessStates = this.awareness.getStates();
        const clientIds = [];
        
        for (const [id, state] of awarenessStates.entries()) {
            if (state.origin === ws) {
                clientIds.push(id);
            }
        }
        
        if (clientIds.length > 0) {
            removeAwarenessStates(this.awareness, clientIds, ws);
        }
        
        this.sessions.delete(ws);
    }

    sendMessage(ws, message) {
        try {
            ws.send(message);
        } catch (err) {
            console.error("Failed to send message:", err);
            this.handleClose(ws);
        }
    }

    sendAwareness(ws, message) {
        const envelope = encoding.createEncoder();
        encoding.writeVarUint(envelope, MESSAGE_AWARENESS);
        encoding.writeVarUint8Array(envelope, message);
        this.sendMessage(ws, encoding.toUint8Array(envelope));
    }

    broadcast(update, origin) {
        const envelope = encoding.createEncoder();
        encoding.writeVarUint(envelope, MESSAGE_SYNC);
        writeUpdate(envelope, update);
        const message = encoding.toUint8Array(envelope);

        this.sessions.forEach((session, ws) => {
            if (ws !== origin) {
                this.sendMessage(ws, message);
            }
        });
    }

    broadcastAwareness(update, origin) {
        const envelope = encoding.createEncoder();
        encoding.writeVarUint(envelope, MESSAGE_AWARENESS);
        encoding.writeVarUint8Array(envelope, update);
        const message = encoding.toUint8Array(envelope);

        this.sessions.forEach((session, ws) => {
            if (ws !== origin) {
                this.sendMessage(ws, message);
            }
        });
    }
}