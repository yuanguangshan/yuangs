# 实时聊天室应用

这是一个基于 Cloudflare Workers 和 Durable Objects 构建的实时聊天室应用。它提供了一个高性能、低延迟的聊天体验，支持文本消息和图片消息的发送与接收，并能实时显示在线用户。

## 🚀 功能特性


*   **实时消息传输**：利用 WebSocket 实现消息的即时发送和接收。
*   **多房间支持**：通过 URL 路径动态创建和加入不同的聊天室。
*   **在线用户列表**：实时显示当前聊天室的在线用户。
*   **历史消息加载**：新用户加入时自动加载聊天历史记录。
*   **图片消息**：支持发送图片，并在客户端进行压缩优化，图片存储在 Cloudflare R2。
*   **消息删除**：支持长按消息进行删除操作。
*   **AI 文本解释**：支持对聊天消息进行 AI 解释，可选择 Gemini 或 DeepSeek 模型，并以 Markdown 格式渲染解释内容。
*   **AI 图片描述**：支持对图片内容进行 AI 描述，可识别图片中的文字，并提供详细的图片描述。
*   **用户名管理**：首次进入自动填充默认用户名，支持本地保存，并允许用户随时点击修改用户名。
*   **代码块优化**：聊天消息中的代码块支持深色主题高亮，提高可读性。
*   **代码块复制**：代码块右上角提供一键复制按钮，方便复制代码内容。
*   **用户统计**：在侧边栏显示当前房间内每个用户的发言次数、在线时长和最近登录时间。
*   **持久化存储**：聊天记录和图片通过 Cloudflare Durable Objects 和 R2 进行持久化存储。
*   **响应式设计**：前端界面适配桌面和移动设备。
*   **自动重连**：WebSocket 连接断开后自动尝试重连。

## 🛠️ 技术栈

*   **后端**：
    *   **Cloudflare Workers**：作为无服务器函数，处理 HTTP 请求和 WebSocket 升级。
    *   **Cloudflare Durable Objects**：用于管理每个聊天室的独立状态、WebSocket 连接和消息持久化。
    *   **Cloudflare R2**：对象存储服务，用于存储用户上传的图片。
    *   **Google Gemini API**：用于文本解释和图片描述。
    *   **DeepSeek API**：用于文本解释。
*   **前端**：
    *   **HTML5**
    *   **CSS3**
    *   **JavaScript (ES6+)**：原生 JavaScript 实现 WebSocket 客户端和 UI 交互。
    *   **marked.js**：用于 Markdown 文本的解析和渲染。
    *   **客户端图片压缩**：在上传前对图片进行压缩处理，优化性能。

## ⚙️ 设置与运行

### 先决条件

*   Node.js (推荐 LTS 版本)
*   npm (Node.js 包管理器)
*   Cloudflare Wrangler CLI：用于开发和部署 Cloudflare Workers。
    ```bash
    npm install -g wrangler
    ```

### 本地开发

1.  **克隆仓库**：
    ```bash
    git clone <您的仓库地址>
    cd realtime-chat-app
    ```
2.  **安装依赖**：
    ```bash
    npm install
    ```
3.  **配置 `wrangler.toml`**：
    打开 `wrangler.toml` 文件，根据您的 Cloudflare 账户信息进行配置，并添加 AI 服务的 API Key：
    *   `name`: 您的 Worker 名称。
    *   `account_id`: 您的 Cloudflare 账户 ID。
    *   `[[r2_buckets]]`：
        *   `bucket_name`: 替换为您的 R2 存储桶名称。如果您还没有 R2 存储桶，请在 Cloudflare 控制台创建一个。
    *   `[[durable_objects.bindings]]`：
        *   `name`: 保持 `CHAT_ROOM_DO`。
        *   `class_name`: 保持 `ChatRoomDurableObject`。
    *   `[[migrations]]`：确保 `tag` 和 `new_sqlite_classes` 配置正确，这对于 Durable Objects 的持久化至关重要。
    *   **AI API Keys**：
        ```toml
        [vars]
        GEMINI_API_KEY = "您的 Google Gemini API Key"
        DEEPSEEK_API_KEY = "您的 DeepSeek API Key"
        ```

    **重要提示**：在本地开发时，`wrangler dev` 会自动模拟 R2 和 Durable Objects 的行为，并将数据持久化到 `.wrangler/state/v3` 目录。

4.  **启动开发服务器**：
    ```bash
    npm run dev
    ```
    Wrangler 会启动一个本地开发服务器，通常在 `http://localhost:8787`。

### 部署到 Cloudflare

1.  **登录 Wrangler** (如果尚未登录)：
    ```bash
    wrangler login
    ```
2.  **部署 Worker**：
    ```bash
    npm run deploy
    ```
    Wrangler 会将您的 Worker 代码部署到 Cloudflare，并提供一个可公开访问的 URL。

## 🚀 使用方法

1.  **访问聊天室**：
    在浏览器中访问您的 Worker URL (本地开发时为 `http://localhost:8787`)，并在后面加上您想进入的聊天室名称，例如：
    *   `http://localhost:8787/general`
    *   `http://localhost:8787/my-private-room`
    *   `http://localhost:8787/developers`

    首次访问时，会提示您输入用户名。如果您不输入，将默认使用“～苑广山”。您的用户名将保存在浏览器本地存储中，下次无需重复输入。

2.  **修改用户名**：
    进入聊天室后，点击页面顶部显示您当前用户名的位置（例如“正在连接... 用户名”），会弹出一个输入框，您可以输入新的用户名并确认。系统将自动保存并使用新用户名重新连接。

3.  **发送文本消息**：
    在底部的输入框中输入文本，按 `Enter` 键发送。按 `Shift + Enter` 键可以换行。文本消息支持 Markdown 格式，发送后会自动渲染。

4.  **发送图片消息**：
    点击输入框旁边的 `📎` (附件) 按钮，选择一张图片。图片会在发送前进行压缩和预览。确认后，点击 `Send` 按钮发送。

5.  **删除消息**：
    长按您发送的消息（在移动设备上是长按，在桌面设备上是鼠标长按），会弹出确认删除的提示。确认后，消息将被删除。

6.  **AI 解释文本消息**：
    长按任意文本消息，会弹出上下文菜单。选择“问 Gemini”或“DeepSeek”，AI 将对该消息内容进行解释，并在消息下方显示解释结果。解释结果支持复制。

7.  **AI 描述图片内容**：
    将鼠标悬停在图片消息上，图片右上角会出现一个“🤖”图标。点击该图标，AI 将对图片内容进行详细描述，包括识别出的文字和图片描述，并在图片下方显示结果。描述结果支持复制。

8.  **复制代码块**：
    将鼠标悬停在聊天消息中的代码块上，代码块右上角会出现一个“复制”按钮。点击该按钮即可将代码内容复制到剪贴板。

9.  **查看在线用户与统计**：
    左侧的侧边栏会显示当前聊天室的在线用户列表。在移动设备上，点击左上角的 `☰` 按钮可以展开侧边栏。侧边栏下方会显示当前房间内每个用户的发言次数、在线时长和最近登录时间。

## 🌐 API / 架构概览

本应用采用以下架构和通信协议：

### 整体架构

```
+-----------------+       +-----------------+       +-----------------+
|                 |       |                 |       |                 |
|    Frontend     |<----->| Cloudflare      |<----->| Cloudflare      |
| (HTML/CSS/JS)   |       | Worker          |       | Durable Object  |
|                 |       | (Router/Proxy)  |       | (Chat Room State|
|                 |       |                 |       |  & Logic)       |
+-----------------+       +-----------------+       +-----------------+
        ^                                                    |
        |                                                    |
        | (Image Upload)                                     | (Image Storage)
        |                                                    v
        +----------------------------------------------------+-----------------+
                                                             | Cloudflare R2   |
                                                             | (Image Storage) |
                                                             +-----------------+
```

*   **Frontend**：用户界面，通过 WebSocket 与 Cloudflare Worker 建立连接，发送和接收消息。在发送图片前进行客户端压缩。
*   **Cloudflare Worker**：作为入口点，处理所有 HTTP 请求。对于 WebSocket 升级请求，它会将请求路由到对应的 Durable Object 实例。对于其他请求（如加载 `index.html`），它会直接响应。同时，它还代理了对 AI 服务的请求。
*   **Cloudflare Durable Object (ChatRoomDurableObject)**：每个聊天室对应一个 Durable Object 实例。它维护聊天室的实时状态（在线用户、消息历史），处理 WebSocket 消息，并将消息广播给所有连接的用户。同时，它负责将图片上传到 Cloudflare R2。
*   **Cloudflare R2**：用于存储用户上传的图片，提供可公开访问的 URL。

### 核心技术点

1.  **Cloudflare Workers (JavaScript/ESM):**
    *   **边缘计算入口:** 作为所有 HTTP 请求的统一入口，处理静态文件服务、WebSocket 升级代理、AI 服务代理 (`/ai-explain`, `/ai-describe-image`) 和文件上传代理 (`/upload`)。
    *   **API Key 安全:** AI 服务的 API Key 通过 Worker 的环境变量安全获取和使用，避免在客户端暴露。
2.  **Cloudflare Durable Objects (DO):**
    *   **有状态的单例:** 每个聊天室（由 `roomName` 标识）对应一个 Durable Object 实例，负责管理该聊天室的在线用户列表和聊天记录。
    *   **WebSocket 连接管理:** 直接处理与客户端的 WebSocket 连接，实现消息的接收、广播和用户状态更新。
    *   **消息持久化:** 利用 DO 的内置存储 (`state.storage`) 将聊天记录持久化，确保数据不丢失，并实现了节流写入机制。
    *   **媒体文件存储集成:** 直接与 Cloudflare R2 集成，处理图片和音频文件的上传，并生成可公开访问的 URL。
    *   **并发控制:** 使用 `state.blockConcurrencyWhile` 确保对共享状态的修改是串行执行的，避免竞态条件。
3.  **Cloudflare R2 (Object Storage):**
    *   **无出口流量费:** 对于存储和分发大量用户生成内容的应用，R2 提供了显著的成本优势。
    *   **全球分布:** 数据在全球边缘节点缓存，提供低延迟访问。
4.  **前端 (HTML/CSS/JavaScript):**
    *   **单页应用 (SPA):** `index.html` 提供了完整的 UI 结构和样式。
    *   **WebSocket API:** 客户端通过 WebSocket 与 Durable Object 建立实时连接。
    *   **媒体处理:** 客户端实现了图片压缩和音频录制功能，优化了上传体验。
    *   **AI 集成:** 通过 `/ai-explain` 和 `/ai-describe-image` 端点调用后端 AI 服务，并使用 `marked.js` 渲染 AI 返回的 Markdown 格式解释。

### 实现效果

1.  **高性能与全球可伸缩性:**
    *   **边缘计算:** Workers 在 Cloudflare 的全球网络边缘运行，大大降低了延迟，提升了用户体验。
    *   **有状态的无服务器:** Durable Objects 解决了传统无服务器函数无状态的痛点，使得构建实时、有状态的应用变得简单且可伸缩。
    *   **媒体分发优化:** R2 结合 Cloudflare CDN，确保媒体文件能够快速、高效地分发给全球用户。
2.  **实时交互与富媒体支持:**
    *   **即时消息:** WebSocket 实现了消息的实时发送和接收，用户体验流畅。
    *   **多媒体消息:** 支持图片和音频的发送，丰富了聊天内容。
    *   **智能辅助:** 集成 AI 解释和图片描述功能，提升了应用的智能性和用户体验。
3.  **安全与可维护性:**
    *   **API Key 隐藏:** AI 服务的 API Key 存储在 Worker 的环境变量中，并通过 Worker 进行代理调用，避免了在客户端暴露敏感信息。
    *   **模块化设计:** 前后端分离，Worker 和 Durable Object 各司其职，AI 逻辑也进行了模块化，提高了代码的可读性和可维护性。
    *   **数据持久化:** 聊天记录的自动持久化确保了数据的可靠性。
4.  **用户体验:**
    *   **响应式 UI:** 适配不同设备尺寸。
    *   **AI 辅助功能:** 提供了消息解释和图片描述功能，增加了应用的智能性和趣味性。
    *   **用户名持久化与修改**：优化了用户首次进入和后续使用的体验。
    *   **代码块可读性与复制**：提升了技术交流的便利性。
    *   **用户统计**：提供了当前房间内用户的活跃度概览。

### 对开发的启示

1.  **拥抱 Serverless 架构:**
    *   **降低运维成本:** 无需管理服务器，只需关注代码逻辑。
    *   **按需付费:** 根据实际使用量付费，成本效益高。
    *   **全球部署:** 自动在全球边缘节点部署，天然具备高可用和低延迟。
2.  **Durable Objects 是构建实时应用的利器:**
    *   对于需要维护持久状态、处理大量并发连接的场景，Durable Objects 提供了一种优雅且强大的解决方案。
    *   理解其单例、有状态和并发控制的特性至关重要。
3.  **WebSocket 在 Serverless 中的应用:**
    *   Durable Objects 完美解决了传统无服务器函数难以维护 WebSocket 连接的问题，使得在无服务器环境中构建实时应用成为可能。
4.  **媒体存储与分发策略:**
    *   对于用户生成内容 (UGC) 的应用，选择合适的云存储服务（如 R2）并结合 CDN 是关键。R2 的无出口流量费优势尤其突出。
    *   客户端的媒体预处理可以显著减少上传时间和带宽消耗。
5.  **安全实践:**
    *   永远不要在客户端代码中硬编码或直接暴露敏感信息。使用后端代理或环境变量是最佳实践。
6.  **前后端协作与 API 设计:**
    *   清晰定义客户端与 Worker/DO 之间的通信协议对于项目的顺利开发和维护至关重要。
    *   Worker 作为 BFF (Backend For Frontend) 层，可以统一处理前端请求，简化前端逻辑，并提供额外的安全和性能优化。
7.  **错误处理与日志:**
    *   在分布式系统中，健壮的错误处理和详细的日志记录对于调试和问题排查至关重要。

### WebSocket 消息协议

客户端和 Durable Object 之间通过 JSON 格式的 WebSocket 消息进行通信。所有消息都包含一个 `type` 字段，用于标识消息类型。

#### 1. 发送消息 (Client -> DO)

*   **文本消息**：
    ```json
    {
        "type": "chat",
        "payload": {
            "text": "Hello, everyone!"
        }
    }
    ```
*   **图片消息**：
    图片数据以 Base64 编码字符串形式发送。
    ```json
    {
        "type": "chat",
        "payload": {
            "type": "image",
            "image": "data:image/jpeg;base64,...", // Base64 编码的图片数据
            "filename": "my_image.jpg",
            "size": 123456, // 图片大小（字节）
            "caption": "Check out this photo!" // 可选的图片描述
        }
    }
    ```
*   **删除消息**：
    ```json
    {
        "type": "delete",
        "payload": {
            "id": "message-uuid-12345" // 要删除的消息的唯一 ID
        }
    }
    ```

#### 2. 接收消息 (DO -> Client)

*   **聊天消息 (文本或图片)**：
    ```json
    {
        "type": "chat",
        "payload": {
            "id": "message-uuid-12345",
            "username": "Alice",
            "timestamp": 1678886400000, // 消息发送时间戳
            "text": "Hello, world!" // 文本消息
        }
    }
    ```
    或
    ```json
    {
        "type": "chat",
        "payload": {
            "id": "message-uuid-67890",
            "username": "Bob",
            "timestamp": 1678886405000,
            "type": "image",
            "imageUrl": "https://pub-xxxxxxxx.r2.dev/chat-images/timestamp-uuid.jpg", // R2 公开访问 URL
            "filename": "my_image.jpg",
            "size": 123456,
            "caption": "A beautiful sunset." // 可选的图片描述
        }
    }
    ```
*   **历史消息**：
    新用户连接时发送，包含一个消息数组。
    ```json
    {
        "type": "history",
        "payload": [
            { /* message 1 */ },
            { /* message 2 */ }
        ]
    }
    ```
*   **系统状态更新 (在线用户)**：
    当用户加入或离开时广播。
    ```json
    {
        "type": "system_state",
        "payload": {
            "users": ["Alice", "Bob", "Charlie"] // 当前在线用户列表
        }
    }
    ```
*   **消息删除确认**：
    当消息被成功删除时广播。
    ```json
    {
        "type": "delete",
        "payload": {
            "id": "message-uuid-12345" // 被删除消息的 ID
        }
    }
    ```
*   **错误消息**：
    当服务器处理客户端请求失败时发送。
    ```json
    {
        "type": "error",
        "payload": {
            "message": "Failed to process your message."
        }
    }
    ```

### HTTP API 端点

除了 WebSocket 协议，Worker 还提供了以下 HTTP API 端点：

*   **`/upload` (POST)**：
    用于上传图片文件到 Cloudflare R2。客户端通过 `X-Filename` 头提供文件名，请求体为图片二进制数据。
    **请求示例**：
    ```http
    POST /upload HTTP/1.1
    Host: your-worker-url.workers.dev
    X-Filename: my_image.jpg
    Content-Type: image/jpeg

    [图片二进制数据]
    ```
    **响应示例**：
    ```json
    {
        "url": "https://pub-xxxxxxxx.r2.dev/my_image.jpg"
    }
    ```

*   **`/ai-explain` (POST)**：
    用于请求 AI 对文本进行解释。支持 `gemini` 和 `deepseek` 模型。
    **请求示例**：
    ```json
    {
        "text": "要解释的文本内容",
        "model": "gemini" // 或 "deepseek"
    }
    ```
    **响应示例**：
    ```json
    {
        "explanation": "AI 解释后的 Markdown 格式文本"
    }
    ```

*   **`/ai-describe-image` (POST)**：
    用于请求 AI 对图片进行描述。目前仅支持 Gemini Vision 模型。
    **请求示例**：
    ```json
    {
        "imageUrl": "https://pub-xxxxxxxx.r2.dev/path/to/image.jpg"
    }
    ```
    **响应示例**：
    ```json
    {
        "description": "图片中包含文字：{文字内容}；图片的描述：{图片描述}"
    }
    ```

*   **`/room-user-stats` (GET)**：
    用于获取当前房间内用户的统计数据，包括发言次数、在线时长和最近登录时间。
    **请求示例**：
    ```http
    GET /room-user-stats?roomName=your-room-name HTTP/1.1
    Host: your-worker-url.workers.dev
    ```
    **响应示例**：
    ```json
    [
        {
            "username": "Alice",
            "messageCount": 15,
            "lastSeen": 1678886400000, // 时间戳
            "totalOnlineDuration": 3600000, // 毫秒
            "isOnline": true
        },
        {
            "username": "Bob",
            "messageCount": 8,
            "lastSeen": 1678885000000,
            "totalOnlineDuration": 1200000,
            "isOnline": false
        }
    ]
    ```

## 💡 未来增强 (可选)

*   **全局用户统计与历史房间记录**：目前的用户统计仅限于当前房间。要实现用户在所有房间的发言次数、总在线时长以及曾经登录过的房间列表，需要一个全局的用户数据存储机制（例如独立的 Durable Object 或 Cloudflare KV），这将涉及更复杂的架构设计。
*   **用户认证与授权**：集成 Cloudflare Access 或其他认证方案，实现用户登录、注册和权限管理。
*   **消息富文本/表情**：支持更丰富的消息格式，如 Markdown、表情符号。
*   **文件传输**：除了图片，支持其他类型文件的传输。
*   **通知功能**：实现桌面通知或浏览器标签页标题闪烁，提醒用户新消息。
*   **聊天室管理界面**：提供一个界面来创建、管理和发现聊天室。
*   **消息引用/回复**：增加消息的引用和回复功能。
*   **更高级的持久化**：对于大规模数据，考虑将 Durable Objects 的数据同步到 Cloudflare D1 (SQLite) 或其他数据库，以支持更复杂的查询和分析。

## 📄 许可证

[根据您的选择添加许可证信息，例如 MIT License]