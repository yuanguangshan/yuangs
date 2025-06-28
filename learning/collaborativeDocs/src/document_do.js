// src/document_do.js

// 导出 DocumentDurableObject 类，以便 worker.js 可以导入并再次导出它
export class DocumentDurableObject {
    // 构造函数在 Durable Object 首次被创建时调用
    constructor(state, env) {
        this.state = state; // `state` 对象用于访问存储和管理并发
        this.env = env;     // `env` 对象包含环境变量和绑定
        this.content = "";  // 在内存中维护文档的当前内容，以实现快速访问
        this.websockets = new Set(); // 使用 Set 存储所有连接到此对象的 WebSocket 客户端

        // 从持久化存储中异步加载之前保存的文档内容
        // 这确保了即使 Durable Object 被销毁并重建，文档内容也不会丢失
        this.state.storage.get("content").then(storedContent => {
            if (storedContent) {
                this.content = storedContent;
            }
        });
    }

    // fetch 方法是 Durable Object 的主入口点，处理所有传入的 HTTP 和 WebSocket 请求
    async fetch(request) {
        // **极其重要**: `blockConcurrencyWhile` 确保所有对该实例的操作都是串行执行的。
        // 这意味着我们不需要担心多个请求同时读写 this.content 或 this.websockets 导致的竞态条件，
        // 极大地简化了状态管理。
        return this.state.blockConcurrencyWhile(async () => {
            const url = new URL(request.url);

            // --- WebSocket 连接处理 ---
            if (url.pathname === "/websocket") {
                const upgradeHeader = request.headers.get("Upgrade");
                if (!upgradeHeader || upgradeHeader !== "websocket") {
                    return new Response("Expected Upgrade: websocket", { status: 426 });
                }

                // 创建一个 WebSocket 对，一个用于客户端，一个用于服务器端（即此 DO 内部）
                const { 0: client, 1: server } = new WebSocketPair();

                // 将服务器端 WebSocket 添加到我们的集合中，以便后续广播
                this.websockets.add(server);

                // --- WebSocket 事件监听 ---
                // 监听来自客户端的消息
                server.addEventListener("message", async event => {
                    // 当收到客户端发送的文档更新时...
                    const newContent = event.data;
                    this.content = newContent; // 1. 更新内存中的内容

                    // 2. 将新内容持久化到存储中
                    await this.state.storage.put("content", this.content);

                    // 3. 将更新广播给所有其他连接的客户端
                    this.broadcast(this.content, server);
                });

                // 监听连接关闭事件
                server.addEventListener("close", evt => {
                    this.websockets.delete(server); // 从集合中移除，停止向其发送消息
                });

                // 监听错误事件
                server.addEventListener("error", err => {
                    this.websockets.delete(server); // 发生错误时也移除
                });

                // 接受 WebSocket 连接
                server.accept();
                // 首次连接时，立即将当前文档的完整内容发送给新客户端
                server.send(this.content);

                // 返回客户端 WebSocket，完成 WebSocket 升级握手
                return new Response(null, { status: 101, webSocket: client });

            // --- 可选的 HTTP 接口 ---
            } else if (url.pathname === "/content") {
                if (request.method === "GET") {
                    return new Response(this.content, { headers: { "Content-Type": "text/plain" } });
                }
            }

            return new Response("Not Found in Durable Object", { status: 404 });
        });
    }

    // 辅助方法：向所有连接的 WebSocket 广播消息
    broadcast(message, sender = null) {
        this.websockets.forEach(ws => {
            // 避免将消息发回给刚刚发送更新的客户端
            if (ws !== sender) {
                try {
                    ws.send(message);
                } catch (err) {
                    // 如果发送失败（例如，客户端已意外断开），则将其从集合中移除
                    this.websockets.delete(ws);
                }
            }
        });
    }
}