## English

### **Global Chat v1.0: Introduction**

This is a feature-rich, real-time, multi-room chat application deployed on the Cloudflare serverless platform. It fully leverages Cloudflare's edge computing capabilities to deliver a highly scalable, low-latency, modern web application without the need to manage traditional servers.

#### **1. Core Project Features**

*   **Real-Time Chat**: Supports multiple users sending and receiving real-time text, image, and audio messages across different rooms.
*   **Audio/Video Calls**: Implemented via WebRTC, with the server handling signaling to establish peer-to-peer audio/video connections between users.
*   **AI-Powered Assistance**:
    *   **Text Explanation**: Integrates both Google Gemini and DeepSeek models to provide users with in-depth text analysis and explanations.
    *   **Image Recognition**: Capable of describing image content and extracting text from images.
*   **Data Visualization**: Integrates the ECharts library, driven by scheduled tasks, to periodically generate charts and post them to the chat room.
*   **File Sharing**: Users can upload files (like images), which are stored in Cloudflare R2 and shared as links within the chat.
*   **User & Permission Management**: Features a fine-grained, whitelist-based room authorization system, complete with a management API.
*   **Automated Tasks**: Utilizes Cron Triggers for scheduled tasks, such as daily message pushes and periodic chart generation.

#### **2. Technical Implementation**

This project serves as an excellent example of a full-stack application built on the Cloudflare ecosystem:

*   **Frontend**: Composed of native HTML (`index.html`, `management.html`) and JavaScript located in the `public` directory. It communicates with the backend in real-time via WebSockets.
*   **Backend Core - Cloudflare Workers (`src/worker.js`)**: Acts as the application's entry point and "switchboard," responsible for:
    *   Handling global API requests (e.g., file uploads, AI calls).
    *   Routing room-specific requests (WebSocket connections, room APIs) to the corresponding Durable Object.
    *   Responding to Cron Triggers to schedule automated tasks.
*   **State Management Core - Durable Objects (`src/chatroom_do.js`)**: This is the technical cornerstone of the project.
    *   Each chat room is an instance of the `HibernatingChating` class.
    *   **State Persistence**: Utilizes the built-in `ctx.storage` to persist each room's message history and user whitelist, enabling a stateful serverless application.
    *   **Real-Time Communication**: Manages all WebSocket sessions connected to a room, handling message reception, processing, and broadcasting.
    *   **WebRTC Signaling Server**: Functions as a signaling server, forwarding `offer`, `answer`, and `candidate` messages to facilitate P2P connections between users.
*   **Storage - Cloudflare R2 (`wrangler.toml`)**: Serves as object storage for user-uploaded media files and generated chart images, made publicly accessible via the custom domain `pic.want.biz`.
*   **AI Service Integration (`src/ai.js`)**: Uses the standard `fetch` API to call the REST APIs of Google Gemini and DeepSeek, with API keys securely stored as environment variables (Secrets).
*   **Deployment & Development (`package.json`, `wrangler.toml`)**: Employs Cloudflare's `wrangler` CLI for one-click development, debugging, and deployment.

#### **3. Unique Features & Highlights**

*   **Pure Serverless Architecture**: The entire application is built on Cloudflare services, eliminating traditional backend servers for superior elasticity, scalability, and potential cost savings.
*   **Elegant "Hibernation" State Management**: The Durable Object is designed with a lazy-loading pattern. It only loads state into memory when active and automatically hibernates when idle, significantly optimizing resource utilization.
*   **Robust Authorization Model**: The "inactive by default" and "whitelist authorization" design for rooms provides a very high level of security and privacy.
*   **Intelligent AI Model Scheduling**: In `src/ai.js`, the application dynamically selects different DeepSeek models based on the time in Beijing. This is an advanced optimization strategy that considers both cost and performance.
*   **Comprehensive Observability**: `chatroom_do.js` includes a detailed `debugLog` system with an API for querying logs, which is crucial for debugging complex, distributed real-time systems.
*   **High-Level Feature Integration**: The project skillfully integrates multiple complex functionalities—real-time communication (WebSocket), P2P calls (WebRTC), object storage (R2), scheduled tasks (Cron), and artificial intelligence (AI APIs)—into a unified Cloudflare Workers architecture, showcasing exceptional technical integration capabilities.

#### **4. In-Depth Module Analysis**

*   **`src/ai.js` (AI Functionality Hub)**
    *   **Multi-Model Strategy**: Encapsulates calls to both DeepSeek and Google Gemini models. The DeepSeek calling strategy dynamically selects models based on Beijing time, likely to optimize for cost or performance.
    *   **Prompt Engineering**: Features carefully crafted prompts for text explanation and image description to achieve high-quality, structured AI output.
    *   **Multi-Modal Processing**: Implements image downloading and Base64 conversion to support submitting image data to Vision APIs.

*   **`src/autoTasks.js` & `src/chart_generator.js` (Automation)**
    *   **Clear Task Scheduling**: Uses a `Map` to associate Cron expressions with task functions, resulting in a clean and easily extensible design.
    *   **Server-Side Rendering**: `chart_generator.js` is a major highlight. It demonstrates a complete pipeline for fetching external data, using ECharts for server-side rendering to generate SVG charts, uploading them to R2, and finally posting them to a chat room via a bot. This is a complex yet powerful automated data visualization pipeline.

*   **`src/chatroom_do.js` (Durable Object Core)**
    *   **Excellent Design**: This file is the heart of the project, with a clear structure and well-defined responsibilities.
    *   **Feature-Complete**: Implements all core chat room functionalities, including state management, WebSocket lifecycle, a RESTful API, RPC interfaces, a heartbeat mechanism, and WebRTC signaling.
    *   **Robustness**: Includes detailed debug logging, error handling, and authorization logic (like the whitelist) to ensure system stability and security.

#### **5. Conclusion**

This project is a technologically advanced and well-architected modern web application. It not only implements a fully functional chat platform but also serves as an outstanding case study on how to leverage the Cloudflare ecosystem to build complex, scalable, and highly available applications.

---

### 🚀 **Installation and Startup Guide**

#### **1. Prerequisites**

Before you begin, ensure you have the following installed:

*   **Node.js** (LTS version recommended)
*   **npm** (usually comes with Node.js)
*   A **Cloudflare account**

#### **2. Install Dependencies**

Clone the project repository:
```bash
git clone https://github.com/yuanguangshan/chating.git
cd chating
```

Install npm dependencies. This project uses `wrangler` for development and deployment, and `echarts` for chart generation.
```bash
npm install
```

#### **3. Cloudflare Configuration**

**Log in to Wrangler**
Run the following command in your terminal. It will open a browser to guide you through authorizing your Cloudflare account.
```bash
npx wrangler login
```

**Configure R2 Bucket**
This project uses Cloudflare R2 to store user-uploaded files (like images) and auto-generated charts.

1.  Create an R2 bucket in your Cloudflare dashboard.
2.  Open the `wrangler.toml` file and update the `bucket_name` in the `r2_buckets` configuration to your new bucket's name.

```toml
# wrangler.toml

[[r2_buckets]]
binding     = "R2_BUCKET"
bucket_name = "your-r2-bucket-name" # ✨ Change this to your R2 bucket name
```

**Configure AI Service Keys (Optional)**
The project integrates AI features. You need to configure the following Secrets in your Worker's settings; otherwise, AI-related functions will not be available.

```bash
npx wrangler secret put GEMINI_API_KEY
# Paste your [Google Gemini API Key] and press Enter

npx wrangler secret put DEEPSEEK_API_KEY
# Paste your [DeepSeek API Key] and press Enter

npx wrangler secret put ADMIN_SECRET
# Enter a [custom admin password for the management panel: https://chating.yourdomain/management/*] and press Enter
```

#### **4. Local Development**

Run the following command to start the local development server. `wrangler` will simulate the Cloudflare environment, including Durable Objects and R2.
```bash
npm run dev
```
After it starts, you can access your application at the address provided in the terminal output (usually `http://localhost:8787`).

#### **5. Deploy to Cloudflare**

When you are ready to deploy your application to Cloudflare's global network, run:
```bash
npm run deploy
```
Upon successful deployment, `wrangler` will provide a public URL. For privacy, all rooms are inaccessible by default. You must go to the management panel, enter a room name, and add at least one member to unlock the chat room. Users not on the whitelist cannot access it. The administrator can add or remove users from the backend at any time.

#### **6. View Real-Time Logs**

You can use the `tail` command to monitor your live application's logs in real-time for easy debugging.
```bash
npm run tail
```



## 中文

### **全球聊天室v1.0介绍**

这是一个功能非常丰富的、部署在 **Cloudflare 无服务器平台**上的**实时多房间聊天应用**。它充分利用了 Cloudflare 的边缘计算能力，实现了一个高度可扩展、低延迟且无需管理传统服务器的现代化 Web 应用。

---

### **1. 项目核心功能**

*   **实时聊天**：支持多用户在不同房间内进行实时文本、图片、音频消息的发送和接收。
*   **音视频通话**：通过 WebRTC 实现，服务器负责信令交换，支持用户间建立点对点的音视频连接。
*   **AI 智能辅助**：
    *   **文本解释**：集成 Google Gemini 和 DeepSeek 两大模型，为用户提供深度文本分析和解释。
    *   **图像识别**：能够描述图片内容，并提取图片中的文字。
*   **数据可视化**：集成 ECharts 库，并通过定时任务驱动，能够定时生成图表并发送到聊天室。
*   **文件共享**：用户可以上传文件（如图片），文件存储在 Cloudflare R2 中，并在聊天中以链接形式分享。
*   **用户与权限管理**：拥有一个精细的、基于白名单的房间授权系统，并提供管理 API。
*   **自动化任务**：通过 Cron Triggers 实现定时任务，如每日消息推送和定时图表生成。

---

### **2. 技术实现路径**

该项目是 Cloudflare 生态系统技术栈的一个绝佳范例：

*   **前端**：由 `public` 目录下的原生 HTML (`index.html`, `management.html`) 和 JavaScript 构成。通过 WebSocket 与后端进行实时通信。
*   **后端核心 - Cloudflare Workers (`src/worker.js`)**：作为应用的入口和“总机”，负责：
    *   处理全局 API 请求（如文件上传、AI 调用）。
    *   将特定于房间的请求（WebSocket 连接、房间 API）路由到对应的 Durable Object。
    *   响应 Cron Triggers，调度定时任务。
*   **状态管理核心 - Durable Objects (`src/chatroom_do.js`)**：这是项目的技术基石。
    *   每个聊天室都是一个 `HibernatingChating` 类的实例。
    *   **状态持久化**：利用 DO 内置的 `ctx.storage` 存储每个房间的消息历史和用户白名单，实现了有状态的无服务器应用。
    *   **实时通信**：管理所有连接到该房间的 WebSocket 会话，负责消息的接收、处理和广播。
    *   **WebRTC 信令服务器**：充当信令服务器，转发 `offer`, `answer`, `candidate` 等消息，促成用户间的 P2P 连接。
*   **存储 - Cloudflare R2 (`wrangler.toml`)**：作为对象存储，用于存放用户上传的媒体文件和生成的图表图片，并通过自定义域名 `pic.want.biz` 提供公开访问。
*   **AI 服务集成 (`src/ai.js`)**：通过标准的 `fetch` API 调用 Google Gemini 和 DeepSeek 的 REST API，并将 API 密钥安全地存储为环境变量。
*   **部署与开发 (`package.json`, `wrangler.toml`)**：使用 Cloudflare 的 `wrangler` CLI 工具进行一键开发、调试和部署。

---

### **3. 项目特色与亮点**

*   **纯粹的无服务器架构**：整个应用完全构建在 Cloudflare 的服务之上，没有传统的后端服务器，具有极高的弹性、可扩展性和潜在的低成本优势。
*   **精巧的“休眠”状态管理**：Durable Object 的设计采用了懒加载模式，仅在活跃时加载状态到内存，不活跃时自动休眠，极大地优化了资源利用率。
*   **健壮的授权模型**：房间“默认未激活”和“白名单授权”的设计，为应用提供了非常高的安全性与私密性。
*   **智能的 AI 模型调度**：在 `src/ai.js` 中，根据北京时间动态选择不同的 DeepSeek 模型，这是一个非常高级的、考虑了成本和性能的优化策略。
*   **全面的可观测性**：`chatroom_do.js` 内置了详尽的 `debugLog` 系统，并提供了 API 进行查询，这对于调试复杂的分布式实时系统至关重要。
*   **功能高度集成**：项目巧妙地将实时通信（WebSocket）、P2P 通话（WebRTC）、对象存储（R2）、定时任务（Cron）和人工智能（AI APIs）等多种复杂功能融合在一个统一的 Cloudflare Workers 架构中，展示了极高的技术整合能力。

---

### **4. 模块深度解析**

#### **`src/ai.js` (AI 功能中心)**

*   **多模型策略**：封装了对 DeepSeek 和 Google Gemini 模型的调用。其中 DeepSeek 的调用策略会根据北京时间动态选择不同模型，可能是为了优化成本或效果。
*   **Prompt Engineering**: 为文本解释和图像描述功能设计了精细的 Prompt，以获取高质量、结构化的 AI 输出。
*   **多模态处理**：实现了图片下载和 Base64 转换，以支持向 Vision API 提交图像数据。

#### **`src/autoTasks.js` & `src/chart_generator.js` (自动化任务)**

*   **清晰的任务调度**：使用 `Map` 将 Cron 表达式与任务函数关联，设计清晰，易于扩展。
*   **服务端图形渲染**：`chart_generator.js` 是项目的一大亮点。它展示了在 Worker 环境中获取外部数据、使用 ECharts 进行服务端渲染生成 SVG 图表、上传到 R2 并最终通过机器人发送到聊天室的完整流程。这是一个复杂但功能强大的自动化数据可视化管道。

#### **`src/chatroom_do.js` (Durable Object 核心)**

*   **设计精良**：该文件是整个项目的核心，代码结构清晰，职责明确。
*   **功能完备**：实现了包括状态管理、WebSocket 生命周期、RESTful API、RPC 接口、心跳机制、WebRTC 信令转发在内的所有核心聊天室功能。
*   **健壮性**：包含了详细的调试日志、错误处理和授权逻辑（如白名单），保证了系统的稳定和安全。

---

### **5. 总结**

该项目是一个技术先进、架构设计精良的现代化 Web 应用。它不仅实现了一个功能完备的聊天平台，更是一个展示如何充分利用 Cloudflare 生态系统构建复杂、可扩展、高可用性应用的优秀案例。


---

## 🚀 安装与启动指南

### **1. 环境准备**

在开始之前，请确保您已安装以下工具：

*   [Node.js](https://nodejs.org/) (建议使用 LTS 版本)
*   [npm](https://www.npmjs.com/) (通常随 Node.js 一起安装)
*   一个 [Cloudflare](https://www.cloudflare.com/) 账户

### **2. 安装依赖**

1.  **克隆项目仓库**
    ```bash
    git clone https://github.com/yuanguangshan/chating.git
    cd chating
    ```

2.  **安装 npm 依赖**
    此项目使用 `wrangler` 进行开发和部署，并依赖 `echarts` 进行图表生成。
    ```bash
    npm install
    ```

### **3. Cloudflare 配置**

1.  **登录 Wrangler**
    在终端运行以下命令，它会打开浏览器引导您完成 Cloudflare 账户的授权。
    ```bash
    npx wrangler login
    ```

2.  **配置 R2 存储桶**
    本项目使用 Cloudflare R2 存储用户上传的文件（如图片）和自动生成的图表。
    *   在 Cloudflare 控制台创建一个 R2 存储桶。
    *   打开 `wrangler.toml` 文件，将 `r2_buckets` 配置中的 `bucket_name` 修改为您创建的桶名。
        ```toml
        # wrangler.toml

        [[r2_buckets]]
        binding     = "R2_BUCKET"
        bucket_name = "your-r2-bucket-name" # ✨ 修改为您自己的 R2 桶名
        ```

3.  **配置 AI 服务密钥 (可选)**
    项目集成了 AI 功能。您需要在 Cloudflare 的 Worker 设置中配置以下 Secrets，否则 AI 相关功能将无法使用。
    ```bash
    npx wrangler secret put GEMINI_API_KEY
    # 粘贴您的 【Google Gemini API Key】 并回车

    npx wrangler secret put DEEPSEEK_API_KEY
    # 粘贴您的 【DeepSeek API Key】 并回车

    npx wrangler secret put ADMIN_SECRET
    # 输入 【自定义管理员密码（管理后台的密码：https://chating.您的域名/management/* 】 并回车
    ```

### **4. 本地开发**

执行以下命令以在本地启动开发服务器。`wrangler` 会模拟 Cloudflare 环境，包括 Durable Objects 和 R2。
```bash
npm run dev
```
启动后，您可以在终端输出的地址 (通常是 `http://localhost:8787`) 访问您的应用。

### **5. 部署到 Cloudflare**

当您准备好将应用部署到全球的 Cloudflare 网络时，运行：
```bash
npm run deploy
```
部署成功后，`wrangler` 会提供一个公开的 URL，任何人都可以通过该 URL 访问您的实时聊天应用。
为了保护隐私，所有房间默认不能访问，须进入[管理后台](https://chating.want.biz/management?secret=ADMIN_SECRET)输入房间名称并增加至少一位成员方才解锁该聊天室。不在白名单的用户不能访问。管理员可随时在后台增删用户。

### **6. 查看实时日志**

您可以使用 `tail` 命令实时监控线上应用的日志，方便调试。
```bash
npm run tail
```
