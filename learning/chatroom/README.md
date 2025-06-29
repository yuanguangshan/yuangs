# 📱 Real-time Chat Room

一个基于 Cloudflare Workers 和 Durable Objects 构建的现代化实时聊天室，支持多房间、图片分享和移动端优化。

[Chat Room Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
[Cloudflare Workers](https://img.shields.io/badge/Platform-Cloudflare%20Workers-orange)
[License](https://img.shields.io/badge/License-MIT-blue)

## ✨ 功能特性

### 🎯 核心功能
- **🔥 实时通信**：基于 WebSocket 的即时消息传递
- **🏠 多房间支持**：通过 URL 路径创建和加入不同聊天室
- **👥 在线用户列表**：实时显示当前房间在线用户
- **💾 消息持久化**：基于 Durable Objects 的消息历史存储
- **📱 移动端优化**：完美适配手机和平板设备

### 🖼️ 图片功能
- **📎 图片发送**：支持拖拽和点击上传图片
- **🗜️ 智能压缩**：前端自动压缩图片节省带宽
- **☁️ R2 存储**：图片永久存储在 Cloudflare R2
- **🔍 预览查看**：点击图片全屏预览
- **📝 图文混合**：支持图片配文字说明

### 🎨 用户体验
- **🌈 现代化 UI**：渐变色彩和流畅动画
- **📲 响应式设计**：桌面和移动端完美适配
- **⌨️ 快捷键支持**：Enter 发送，Shift+Enter 换行
- **🔄 断线重连**：网络异常时自动重连提示
- **🚀 PWA 就绪**：支持添加到主屏幕

## 🏗️ 技术架构

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   前端 (HTML)   │◄──►│ Cloudflare Worker │◄──►│ Durable Object  │
│                 │    │                  │    │                 │
│ • WebSocket     │    │ • 路由处理       │    │ • 状态管理      │
│ • 图片压缩      │    │ • 静态文件服务   │    │ • 消息存储      │
│ • 响应式 UI     │    │ • WebSocket 升级 │    │ • 用户会话      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Cloudflare R2  │
                       │                 │
                       │ • 图片存储      │
                       │ • CDN 分发      │
                       │ • 永久保存      │
                       └─────────────────┘
```

### 核心技术栈
- **前端**：原生 HTML/CSS/JavaScript（无框架依赖）
- **后端**：Cloudflare Workers + Durable Objects
- **存储**：Cloudflare R2 + Durable Objects Storage
- **通信**：WebSocket + 自定义消息协议
- **部署**：Wrangler CLI

## 🚀 快速开始

### 前置要求
- Node.js 16+
- Cloudflare 账户
- Wrangler CLI

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd chatroom
```

### 2. 安装依赖
```bash
npm install -g wrangler
```

### 3. 配置 R2 存储桶
```bash
# 创建 R2 存储桶
wrangler r2 bucket create yuangs

# 配置公开访问（可选）
wrangler r2 bucket cors put yuangs —cors-file cors.json
```

### 4. 配置环境
修改 `wrangler.toml` 中的配置：
```toml
[[r2_buckets]]
binding = ”R2_BUCKET“
bucket_name = ”yuangs“  # 您的 R2 存储桶名称
```

更新代码中的 R2 公开域名：
```javascript
// src/chatroom_do.js 第 60 行左右
const imageUrl = `https://your-r2-domain.r2.dev/${key}`;
```

### 5. 部署
```bash
wrangler deploy
```

### 6. 访问应用
```
https://your-worker.your-subdomain.workers.dev/room-name
```

## 📁 项目结构

```
chatroom/
├── src/
│   ├── worker.js           # Worker 主入口
│   └── chatroom_do.js      # Durable Object 实现
├── public/
│   └── index.html          # 前端页面
├── wrangler.toml           # Worker 配置文件
├── package.json
└── README.md
```

### 文件说明

#### `src/worker.js`
- Worker 主入口文件
- 处理 HTTP 请求路由
- 静态文件服务
- WebSocket 升级

#### `src/chatroom_do.js`
- Durable Object 实现
- 管理聊天室状态
- WebSocket 连接处理
- 消息存储和广播
- R2 图片上传

#### `public/index.html`
- 单页应用前端
- 响应式 UI 设计
- WebSocket 客户端
- 图片压缩和预览

## 🔧 配置选项

### R2 存储配置
```toml
[[r2_buckets]]
binding = ”R2_BUCKET“
bucket_name = ”your-bucket-name“
```

### 消息协议
```javascript
// 文本消息
{
  type: ’chat‘,
  payload: {
    text: ’Hello world!‘
  }
}

// 图片消息
{
  type: ’chat‘,
  payload: {
    type: ’image‘,
    image: ’data:image/jpeg;base64,...‘,
    filename: ’photo.jpg‘,
    size: 123456,
    caption: ’可选说明文字‘
  }
}
```

## 📱 使用指南

### 基本操作
1. **加入房间**：访问 `/房间名` 路径
2. **发送消息**：在输入框输入文字，按 Enter 发送
3. **换行**：按 Shift+Enter 在消息中换行
4. **发送图片**：点击 📎 按钮选择图片

### 移动端使用
- **侧边栏**：点击 ☰ 按钮查看在线用户
- **图片查看**：点击图片全屏预览
- **输入优化**：支持软键盘自动适配

### 房间管理
- **创建房间**：直接访问新的房间名即可创建
- **房间持久化**：聊天记录自动保存
- **用户限制**：无需注册，输入用户名即可使用

## 🛠️ 开发指南

### 本地开发
```bash
# 启动开发服务器
wrangler dev

# 查看实时日志
wrangler tail
```

### 自定义功能

#### 添加新消息类型
1. 在 `chatroom_do.js` 中定义新的消息类型常量
2. 在 `handleChatMessage` 中添加处理逻辑
3. 在前端 `appendChatMessage` 中添加显示逻辑

#### 修改 UI 样式
所有样式都在 `index.html` 的 `<style>` 标签中，支持：
- CSS 变量自定义主题色
- 响应式断点调整
- 动画效果定制

#### 扩展存储功能
可以在 Durable Object 中添加更多持久化数据：
```javascript
await this.state.storage.put(”custom-data“, data);
```

## 🔒 安全考虑

- **输入验证**：所有用户输入都经过 HTML 转义
- **文件类型限制**：仅支持图片文件上传
- **文件大小限制**：前端压缩图片避免过大文件
- **CORS 配置**：R2 存储桶配置适当的跨域策略

## 📊 性能优化

### 前端优化
- **图片懒加载**：使用 `loading=”lazy“` 属性
- **图片压缩**：Canvas API 压缩到 800x600
- **CSS 优化**：使用 CSS 变换而非重绘
- **事件节流**：输入框高度调整使用节流

### 后端优化
- **消息限制**：内存中最多保存 100 条消息
- **存储节流**：5秒内最多保存一次到持久化存储
- **并发控制**：使用 `blockConcurrencyWhile` 避免竞态

## 🌍 部署选项

### Cloudflare Workers
```bash
wrangler deploy
```

### 自定义域名
在 Cloudflare 控制台中配置自定义域名绑定。

### 环境变量
```toml
[env.production]
[[env.production.r2_buckets]]
binding = ”R2_BUCKET“
bucket_name = ”chatroom-prod“
```

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m ’Add some AmazingFeature‘`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📋 待办事项

- [ ] 添加用户头像支持
- [ ] 实现消息回复功能
- [ ] 添加 @ 提及功能
- [ ] 支持 Markdown 格式
- [ ] 添加表情符号选择器
- [ ] 实现私人消息
- [ ] 添加管理员功能
- [ ] 支持音频消息
- [ ] 实现消息搜索
- [ ] 添加主题切换

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

- [Cloudflare Workers](https://workers.cloudflare.com/) - 无服务器计算平台
- [Durable Objects](https://developers.cloudflare.com/workers/learning/using-durable-objects/) - 有状态计算
- [Cloudflare R2](https://developers.cloudflare.com/r2/) - 对象存储服务

## 📞 联系方式

如有问题或建议，请：
- 创建 [Issue](https://github.com/your-username/chatroom/issues)
- 发送邮件至：your-email@example.com
- 访问 [项目主页](https://your-chatroom.workers.dev)

—

⭐ **如果这个项目对您有帮助，请给一个 Star！**