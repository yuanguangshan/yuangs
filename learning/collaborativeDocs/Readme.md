my-collaborative-doc/
├── src/
│   ├── worker.js         # (已修正) Cloudflare Worker 入口，负责路由
│   └── document_do.js    # Durable Object 的实现
├── public/
│   └── index.html        # 客户端网页
└── wrangler.toml         # (已修正) 项目配置文件


这套代码是经过调试后最终成功部署并运行的版本。

---

### 项目最终结构

为了清晰起见，我们再次确认一下项目的文件结构：

```
my-collaborative-doc/
├── src/
│   ├── worker.js         # (已修正) Cloudflare Worker 入口，负责路由
│   └── document_do.js    # Durable Object 的实现
├── public/
│   └── index.html        # 客户端网页
└── wrangler.toml         # (已修正) 项目配置文件
```

---

### 1. `wrangler.toml` (最终配置文件)

这是项目的核心配置文件，它告诉 Cloudflare 如何部署您的应用。我们对它做了两次关键的修正。

```toml
# wrangler.toml

# Worker 的名称，将成为 URL 的一部分
name = "my-collaborative-doc"

# Worker 的主入口文件路径
main = "src/worker.js"

# 兼容性日期，确保 Worker 在一个可预测的环境中运行
compatibility_date = "2023-10-26"

# --- Durable Object 绑定定义 ---
# 这部分将代码中的一个类与一个可以在 Worker 中访问的绑定名称关联起来
[[durable_objects.bindings]]
# 在 worker.js 中，我们将通过 env.DOCUMENT_DO 来访问这个 Durable Object
name = "DOCUMENT_DO" 
# 这个绑定对应于在代码中导出的类的名称
class_name = "DocumentDurableObject" 

# --- Durable Object 迁移配置 (关键修正 #1) ---
# 每次部署新的或修改 Durable Object 类时，都需要一个迁移条目
[[migrations]]
# 一个用于标识此次迁移的版本标签，可以是任意字符串
tag = "v1" 
# 关键修正：对于免费计划，必须使用 new_sqlite_classes 来创建基于 SQLite 的新存储。
# 这取代了旧的 new_classes，解决了部署时的 API 错误 (code: 10097)。
new_sqlite_classes = ["DocumentDurableObject"]

# --- 资源导入规则 (关键修正 #2) ---
# 这部分告诉 Wrangler 如何处理非 JavaScript 文件的导入
[[rules]]
# 将匹配的文件类型定义为 "Text"，意味着它们将被作为纯文本字符串导入
type = "Text"
# "globs" 是一个文件匹配模式。这个模式表示匹配任何目录下所有以 .html 结尾的文件。
# 这解决了在 worker.js 中 `import html from '../public/index.html'` 导致的运行时错误。
globs = ["**/*.html"]
```

---

### 2. `src/document_do.js` (Durable Object 实现)

这是应用的核心逻辑所在。每个文档都有一个独立的 `DocumentDurableObject` 实例来管理其状态。

```javascript
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
```

---

### 3. `src/worker.js` (Worker 入口 - 最终修正版)

这是所有外部请求的第一个接触点。它的主要工作是解析 URL，并将请求正确地路由到 Durable Object 或提供前端页面。

```javascript
// src/worker.js

// 1. 导入资源
// 通过 `wrangler.toml` 中的 `[[rules]]` 配置，Wrangler 会将 HTML 文件作为文本字符串导入
import html from '../public/index.html';
// 从我们的 Durable Object 文件中导入类定义
import { DocumentDurableObject } from './document_do.js';

// 2. 导出 Durable Object 类 (关键修正)
// 这一步至关重要，它将我们的 DO 类暴露给 Cloudflare 平台，
// 否则平台不知道 `class_name = "DocumentDurableObject"` 对应的是哪个类。
export { DocumentDurableObject };

// 3. 默认导出的 fetch 处理程序
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/');

        // --- 路由逻辑 ---
        // 我们期望的 URL 格式是 /docs/<document-id>/...
        if (pathParts[1] !== 'docs' || !pathParts[2]) {
            return new Response('Not Found. Please access /docs/<document-name>', { status: 404 });
        }
        const documentId = pathParts[2]; // 例如 "my-first-doc"

        // 提取子路径，例如 "/websocket"
        const subPath = '/' + pathParts.slice(3).join('/');

        // --- 决策：转发给 DO 还是提供 HTML ---
        // 如果有子路径（如 /websocket），说明请求是针对 DO 的 API
        if (subPath && subPath !== '/') {
            // `idFromName` 确保对于同一个 `documentId`，我们总是获取到同一个 DO 实例
            const doId = env.DOCUMENT_DO.idFromName(documentId);
            // 获取 DO 的 "存根 (stub)"，它是一个可以与之通信的代理对象
            const stub = env.DOCUMENT_DO.get(doId);

            // --- 请求转发 (关键修正) ---
            // 创建一个新的 URL，只包含 DO 关心的路径部分（例如 /websocket）
            const doUrl = new URL(request.url);
            doUrl.pathname = subPath;
            
            // 创建一个全新的请求对象。这是转发请求的推荐方式，因为它避免了直接修改
            // 传入的 request 对象，更加健壮，解决了之前的运行时错误。
            const doRequest = new Request(doUrl, request);

            // 将新请求转发给获取到的 DO 实例
            return stub.fetch(doRequest);

        } else {
            // 如果没有子路径，说明用户正在访问文档本身，我们提供 HTML 前端页面
            return new Response(html, {
                headers: { 'Content-Type': 'text/html;charset=UTF-8' },
            });
        }
    },
};
```

---

### 4. `public/index.html` (客户端网页)

这是用户在浏览器中看到的界面。它包含一个文本区域和一些 JavaScript 代码，用于处理 WebSocket 通信。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collaborative Document</title>
    <style>
        body { font-family: sans-serif; margin: 20px; }
        textarea { width: 80%; height: 400px; padding: 10px; font-size: 16px; border: 1px solid #ccc; }
        #status { margin-top: 10px; color: green; }
    </style>
</head>
<body>
    <h1>Collaborative Document</h1>
    <p>Open this page in multiple tabs/browsers to see real-time collaboration.</p>
    <p>Document ID: <span id="docIdDisplay"></span></p>
    <textarea id="documentContent"></textarea>
    <div id="status">Connecting...</div>

    <script>
        const docIdDisplay = document.getElementById('docIdDisplay');
        const documentContent = document.getElementById('documentContent');
        const statusDiv = document.getElementById('status');

        // 从浏览器地址栏的路径中提取文档 ID
        const pathParts = window.location.pathname.split('/');
        const documentId = pathParts[2] || 'default-doc'; // 如果 URL 中没有，则使用默认 ID
        docIdDisplay.textContent = documentId;

        // 根据当前页面的协议 (http/https) 构建 WebSocket URL (ws/wss)
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}/docs/${documentId}/websocket`;

        let ws;
        let debounceTimeout;

        function connectWebSocket() {
            statusDiv.textContent = 'Connecting...';
            ws = new WebSocket(wsUrl);

            // --- WebSocket 事件处理 ---
            // 当连接成功建立时调用
            ws.onopen = () => {
                statusDiv.textContent = 'Connected!';
            };

            // 当从服务器（Durable Object）收到消息时调用
            ws.onmessage = (event) => {
                const receivedContent = event.data;
                // 只有当内容确实发生变化时才更新，避免不必要的光标跳动
                if (documentContent.value !== receivedContent) {
                    // 保存当前光标位置，以提供更好的用户体验
                    const cursorStart = documentContent.selectionStart;
                    const cursorEnd = documentContent.selectionEnd;
                    documentContent.value = receivedContent;
                    // 尝试恢复光标位置
                    documentContent.setSelectionRange(cursorStart, cursorEnd);
                }
            };

            // 当连接关闭时调用
            ws.onclose = (event) => {
                statusDiv.textContent = `Disconnected. Reconnecting in 3s...`;
                // 实现简单的自动重连机制
                setTimeout(connectWebSocket, 3000);
            };

            // 当发生错误时调用
            ws.onerror = (error) => {
                statusDiv.textContent = 'WebSocket error. Reconnecting...';
                ws.close(); // 触发 onclose 事件，从而启动重连逻辑
            };
        }

        // --- 用户输入处理 ---
        // 监听 textarea 的输入事件
        documentContent.addEventListener('input', () => {
            // 使用防抖 (debounce) 技术来优化性能
            // 清除上一个计时器
            clearTimeout(debounceTimeout);
            // 设置一个新的计时器，在用户停止输入 200 毫秒后才发送更新
            // 这可以避免在用户快速打字时发送大量不必要的消息
            debounceTimeout = setTimeout(() => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                    // 将 textarea 的当前全部内容发送给 Durable Object
                    ws.send(documentContent.value);
                }
            }, 200);
        });

        // 页面加载时，立即开始连接 WebSocket
        connectWebSocket();
    </script>
</body>
</html>
```