# 云端待办事项 PWA

部署在 Cloudflare Workers 上的待办事项管理PWA应用。

## 功能

- 使用 Materialize CSS 的现代UI
- 支持离线功能的服务工作线程
- 使用 D1 数据库进行云端数据持久化
- 日历导出功能（iCal 格式）
- 适用于所有设备的响应式设计
- 支持设置截止日期和时间

## 部署到 Cloudflare Workers

1. 安装 Wrangler CLI:
```bash
npm install -g wrangler
```

2. 登录 Cloudflare:
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

4. 部署:
```bash
npx wrangler deploy
```

## 项目结构

- `index.html` - 主 HTML 文件
- `styles.css` - 样式
- `app.js` - 应用程序逻辑
- `sw.js` - 服务工作线程，用于PWA功能
- `manifest.json` - PWA 清单
- `icon-*.svg` - 应用图标（SVG格式）
- `src/index.js` - Cloudflare Worker 入口点（包含嵌入的HTML/CSS/JS内容）
- `wrangler.toml` - Wrangler 配置

## 日历集成

该应用包含一个"同步日历"按钮，可将您的任务导出为 iCalendar (.ics) 文件。然后您可以将此文件导入到您首选的日历应用程序中（Google Calendar, Apple Calendar, Outlook等）。

导入方法：
1. 点击"同步日历"下载 .ics 文件
2. 将文件导入到您的日历应用程序：
   - Google Calendar: 设置 → 导入与导出 → 选择文件
   - Apple Calendar: 文件 → 导入
   - Outlook: 文件 → 打开与导出 → 导入 → 从其他程序导入

## 开发

在本地开发运行应用程序：

```bash
# 安装依赖
npm install

# 启动开发服务器（需要 Wrangler）
wrangler dev
```

然后在浏览器中访问 `http://localhost:8787`。

## 浏览器支持

此应用程序使用现代网络技术，包括：
- 服务工作线程（用于PWA功能）
- D1 数据库（用于数据持久化）
- ES6 JavaScript 特性

适用于所有现代浏览器（Chrome, Firefox, Safari, Edge）。

## 开发和部署工作流程

此项目使用嵌入式部署方式，HTML、CSS、JS 等资源直接嵌入在 `src/index.js` 中，并使用 D1 数据库存储任务。

### 重要：修改和部署流程
1. 修改根目录的源文件 (`index.html`, `app.js`, `styles.css` 等)
2. 测试功能正常
3. **关键步骤**：由于使用嵌入式部署，需要将更新同步到 `src/index.js` 中的对应内容
4. 部署：`npx wrangler deploy`

### 当前部署状态
- ✅ **完全功能正常** - 所有功能都已上线
- ✅ **D1数据库集成** - 数据存储在云端数据库
- ✅ **时间输入功能** - 支持设置日期和时间
- ✅ **自定义域名** - todo.want.biz 已正确配置

### 部署命令
- 部署：`npx wrangler deploy`
- 本地开发：`wrangler dev`

### 注意事项
- 修改 `index.html` 或 `app.js` 后，需要手动更新 `src/index.js` 中的嵌入内容
- 数据存储在 D1 数据库中，而非本地 localStorage
- API 路径使用 `/data/` 而非 `/api/` 以避免 Cloudflare 安全规则冲突
- 项目已清理，只保留必要文件