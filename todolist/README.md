# Cloudflare Todo List PWA / 云端待办事项 PWA

A bilingual progressive web application for managing your todos, deployed on Cloudflare Workers.
支持中英文的待办事项管理PWA应用，部署在Cloudflare Workers上。

## Features / 功能

- Modern UI with Materialize CSS / 使用 Materialize CSS 的现代UI
- Offline functionality with service worker / 支持离线功能的服务工作线程
- Local data persistence using localStorage / 使用 localStorage 进行本地数据持久化
- Calendar export functionality (iCal format) / 日历导出功能（iCal 格式）
- Responsive design for all devices / 适用于所有设备的响应式设计

## Deployment to Cloudflare Workers / 部署到 Cloudflare Workers

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. 获取并配置您的 Cloudflare 账户ID：
```toml
[env.production]
account_id = "YOUR_ACCOUNT_ID_HERE"
```

获取账户ID的方法：
- 登录 Cloudflare Dashboard (dash.cloudflare.com)
- 转到 "Workers & Pages" 部分
- 您的账户ID会显示在页面上
- 将 "YOUR_ACCOUNT_ID_HERE" 替换为实际的账户ID

成功部署后，您的应用将可通过类似以下URL访问：
`https://your-app-name.your-username.workers.dev`

4. 构建和部署:
```bash
npm run deploy
```

或者，您可以直接使用 Wrangler:
```bash
wrangler deploy
```

## Project Structure / 项目结构

- `index.html` - Main HTML file / 主 HTML 文件
- `styles.css` - Styling / 样式
- `app.js` - Application logic / 应用程序逻辑
- `sw.js` - Service worker for PWA functionality / 服务工作线程，用于PWA功能
- `manifest.json` - PWA manifest / PWA 清单
- `icon-*.png` - App icons (placeholder as SVG) / 应用图标（SVG占位符）
- `src/index.js` - Cloudflare Worker entry point / Cloudflare Worker 入口点
- `wrangler.toml` - Wrangler configuration / Wrangler 配置
- `README-zh.md` - Chinese documentation / 中文文档

## Calendar Integration / 日历集成

The app includes a "Sync with Calendar" button that exports your tasks to an iCalendar (.ics) file. You can then import this file into your preferred calendar application (Google Calendar, Apple Calendar, Outlook, etc.).
该应用包含一个"同步日历"按钮，可将您的任务导出为 iCalendar (.ics) 文件。然后您可以将此文件导入到您首选的日历应用程序中（Google Calendar, Apple Calendar, Outlook等）。

To import / 导入方法：
1. Click "Sync with Calendar" to download the .ics file / 点击"同步日历"下载 .ics 文件
2. Import the file into your calendar application / 将文件导入到您的日历应用程序：
   - Google Calendar: Settings → Import & Export → Select file / 设置 → 导入与导出 → 选择文件
   - Apple Calendar: File → Import / 文件 → 导入
   - Outlook: File → Open & Export → Import → Import from another program / 文件 → 打开与导出 → 导入 → 从其他程序导入

## Development / 开发

To run the application locally for development / 在本地开发运行应用程序：

```bash
# Install dependencies / 安装依赖
npm install

# Start development server (requires Wrangler) / 启动开发服务器（需要 Wrangler）
wrangler dev
```

Then navigate to `http://localhost:8787` in your browser / 然后在浏览器中访问 `http://localhost:8787`。

## Browser Support / 浏览器支持

This application uses modern web technologies including:
- Service Workers (for PWA functionality)
- localStorage (for data persistence)
- ES6 JavaScript features

It works in all modern browsers (Chrome, Firefox, Safari, Edge).
此应用程序使用现代网络技术，包括：
- 服务工作线程（用于PWA功能）
- localStorage（用于数据持久化）
- ES6 JavaScript 特性

适用于所有现代浏览器（Chrome, Firefox, Safari, Edge）。