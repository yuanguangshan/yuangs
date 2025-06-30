# 实时聊天室应用

这是一个基于 Cloudflare Workers 和 Durable Objects 构建的实时聊天室应用。它提供了一个高性能、低延迟的聊天体验，支持文本消息和图片消息的发送与接收，并能实时显示在线用户。

## 🚀 功能特性

*   **实时消息传输**：利用 WebSocket 实现消息的即时发送和接收。
*   **多房间支持**：通过 URL 路径动态创建和加入不同的聊天室。
*   **在线用户列表**：实时显示当前聊天室的在线用户。
*   **历史消息加载**：新用户加入时自动加载聊天历史记录。
*   **图片消息**：支持发送图片，并在客户端进行压缩优化，图片存储在 Cloudflare R2。
*   **消息删除**：支持长按消息进行删除操作。
*   **持久化存储**：聊天记录和图片通过 Cloudflare Durable Objects 和 R2 进行持久化存储。
*   **响应式设计**：前端界面适配桌面和移动设备。
*   **自动重连**：WebSocket 连接断开后自动尝试重连。

## 🛠️ 技术栈

*   **后端**：
    *   **Cloudflare Workers**：作为无服务器函数，处理 HTTP 请求和 WebSocket 升级。
    *   **Cloudflare Durable Objects**：用于管理每个聊天室的独立状态、WebSocket 连接和消息持久化。
    *   **Cloudflare R2**：对象存储服务，用于存储用户上传的图片。
*   **前端**：
    *   **HTML5**
    *   **CSS3**
    *   **JavaScript (ES6+)**：原生 JavaScript 实现 WebSocket 客户端和 UI 交互。
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
    打开 `wrangler.toml` 文件，根据您的 Cloudflare 账户信息进行配置：
    *   `name`: 您的 Worker 名称。
    *   `account_id`: 您的 Cloudflare 账户 ID。
    *   `[[r2_buckets]]`：
        *   `bucket_name`: 替换为您的 R2 存储桶名称。如果您还没有 R2 存储桶，请在 Cloudflare 控制台创建一个。
    *   `[[durable_objects.bindings]]`：
        *   `name`: 保持 `CHAT_ROOM_DO`。
        *   `class_name`: 保持 `ChatRoomDurableObject`。
    *   `[[migrations]]`：确保 `tag` 和 `new_sqlite_classes` 配置正确，这对于 Durable Objects 的持久化至关重要。

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

    首次访问时，会提示您输入用户名。

2.  **发送文本消息**：
    在底部的输入框中输入文本，按 `Enter` 键发送。按 `Shift + Enter` 键可以换行。

3.  **发送图片消息**：
    点击输入框旁边的 `📎` (附件) 按钮，选择一张图片。图片会在发送前进行压缩和预览。确认后，点击 `Send` 按钮发送。

4.  **删除消息**：
    长按您发送的消息（在移动设备上是长按，在桌面设备上是鼠标长按），会弹出确认删除的提示。确认后，消息将被删除。

5.  **查看在线用户**：
    左侧的侧边栏会显示当前聊天室的在线用户列表。在移动设备上，点击左上角的 `☰` 按钮可以展开侧边栏。

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
*   **Cloudflare Worker**：作为入口点，处理所有 HTTP 请求。对于 WebSocket 升级请求，它会将请求路由到对应的 Durable Object 实例。对于其他请求（如加载 `index.html`），它会直接响应。
*   **Cloudflare Durable Object (ChatRoomDurableObject)**：每个聊天室对应一个 Durable Object 实例。它维护聊天室的实时状态（在线用户、消息历史），处理 WebSocket 消息，并将消息广播给所有连接的用户。同时，它负责将图片上传到 Cloudflare R2。
*   **Cloudflare R2**：用于存储用户上传的图片，提供可公开访问的 URL。

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

## 💡 未来增强 (可选)

*   **用户认证与授权**：集成 Cloudflare Access 或其他认证方案，实现用户登录、注册和权限管理。
*   **消息富文本/表情**：支持更丰富的消息格式，如 Markdown、表情符号。
*   **文件传输**：除了图片，支持其他类型文件的传输。
*   **通知功能**：实现桌面通知或浏览器标签页标题闪烁，提醒用户新消息。
*   **聊天室管理界面**：提供一个界面来创建、管理和发现聊天室。
*   **消息引用/回复**：增加消息的引用和回复功能。
*   **更高级的持久化**：对于大规模数据，考虑将 Durable Objects 的数据同步到 Cloudflare D1 (SQLite) 或其他数据库，以支持更复杂的查询和分析。

## 📄 许可证

[根据您的选择添加许可证信息，例如 MIT License]