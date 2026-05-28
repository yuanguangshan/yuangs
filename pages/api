# 知识管理系统完整 API 文档

> 本文档涵盖 **Knowly**、**WeClaw**、**knasync** 三个项目的全部 HTTP API 端点，包含详细说明、请求/响应示例及认证方式。

---

## 目录

- [1. Knowly API](#1-knowly-api)
  - [1.1 日志 API](#11-日志-api)
  - [1.2 归档 API](#12-归档-api)
  - [1.3 历史 API](#13-历史-api)
  - [1.4 发布 API](#14-发布-api)
  - [1.5 搜索 API](#15-搜索-api)
  - [1.6 统计 API](#16-统计-api)
  - [1.7 配置 API](#17-配置-api)
  - [1.8 管理 API](#18-管理-api)
  - [1.9 文件上传 API](#19-文件上传-api)
  - [1.10 前端页面](#110-前端页面)
- [2. WeClaw API](#2-weclaw-api)
  - [2.1 消息发送](#21-消息发送)
  - [2.2 服务状态与配置](#22-服务状态与配置)
  - [2.3 Agent 管理](#23-agent-管理)
  - [2.4 账号与登录](#24-账号与登录)
  - [2.5 Hub 共享文件](#25-hub-共享文件)
  - [2.6 待办、定时器、定时任务](#26-待办定时器定时任务)
  - [2.7 服务控制](#27-服务控制)
  - [2.8 健康检查与日志](#28-健康检查与日志)
  - [2.9 管理后台](#29-管理后台)
- [3. knasync API](#3-knasync-api)
  - [3.1 健康检查](#31-健康检查)
  - [3.2 提交内容](#32-提交内容)
  - [3.3 拉取队列](#33-拉取队列)
  - [3.4 查看队列（只读）](#34-查看队列只读)
  - [3.5 推送结果](#35-推送结果)
  - [3.6 获取结果](#36-获取结果)
  - [3.7 清空数据](#37-清空数据)
  - [3.8 API 文档](#38-api-文档)
- [4. 附录](#4-附录)
  - [4.1 全局认证说明](#41-全局认证说明)
  - [4.2 常见错误码](#42-常见错误码)

---

# 1. Knowly API

**Base URL:**  
- 本地：`http://localhost:8090`  
- 公网：`https://knowly.want.biz`

**认证方式:**  
若配置了 `web.auth`（格式 `user:password`），所有请求需携带 HTTP Basic Auth。  
示例：`curl -u "admin:secret" https://knowly.want.biz/api/status`  
未配置时无需认证。

---

## 1.1 日志 API

### 1.1.1 GET /api/logs

获取最近的日志条目。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `level` | string | 否 | 日志级别：`info`, `warn`, `error`, `all`，默认全部 |
| `limit` | int | 否 | 返回条数，默认 300 |

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/logs?level=info&limit=50"
```

**响应示例**

```json
[
  {
    "timestamp": "2026-05-21 18:00:00",
    "level": "INFO",
    "message": "knowly started"
  },
  {
    "timestamp": "2026-05-21 18:00:05",
    "level": "INFO",
    "message": "SSH connection established"
  }
]
```

### 1.1.2 GET /api/logs/stream

SSE 实时日志流。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `level` | string | 否 | 日志级别过滤 |

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/logs/stream?level=info"
```

**响应**: `text/event-stream`，每条日志为一行 `data: ...`，客户端保持连接持续接收。

---

## 1.2 归档 API

通过 SSH 连接远程 NAS 浏览归档文件。

### 1.2.1 GET /api/archive/list

列出指定目录下的文件/子目录。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `path` | string | 是 | 相对于 `ssh.base_path` 的路径，如 `2026/05/21` |

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/archive/list?path=2026/05/21"
```

**响应示例**

```json
[
  {
    "name": "article.md",
    "is_dir": false,
    "size": 4096,
    "mod_time": "2026-05-21T10:00:00Z",
    "title": "文章标题"
  },
  {
    "name": "subdir",
    "is_dir": true,
    "size": 0,
    "mod_time": "2026-05-21T09:00:00Z"
  }
]
```

### 1.2.2 GET /api/archive/today

一次性返回归档初始化数据（年/月/日层级 + 当日文件）。

**无参数**

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/archive/today"
```

**响应示例**

```json
{
  "years": [{ "name": "2026", "is_dir": true }],
  "months": [{ "name": "05", "is_dir": true }],
  "days": [{ "name": "21", "is_dir": true }],
  "files": [{ "name": "article.md", "is_dir": false, "size": 1234 }],
  "year": "2026",
  "month": "05",
  "day": "21"
}
```

### 1.2.3 GET /api/archive/file

读取归档文件内容（在线预览）。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `path` | string | 是 | 相对于 `ssh.base_path` 的文件路径 |

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/archive/file?path=2026/05/21/article.md"
```

**响应**: 文件内容，自动设置 `Content-Type`（`.md` 为 `text/plain`，`.png` 为 `image/png` 等）。

### 1.2.4 GET /api/archive/download

下载归档文件（强制下载对话框）。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `path` | string | 是 | 相对于 `ssh.base_path` 的文件路径 |

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/archive/download?path=2026/05/21/article.md" -o article.md
```

**响应**: 文件二进制流，带 `Content-Disposition: attachment` header。

---

## 1.3 历史 API

### 1.3.1 GET /api/history

获取本地历史记录列表。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `limit` | int | 否 | 返回条数，默认 50 |
| `type` | string | 否 | 类型过滤：`clipboard`, `sync`, `all` |
| `tag` | string | 否 | 标签过滤，匹配包含该标签的条目 |
| `after` | string | 否 | 分页：返回该时间戳**之前**的条目，格式 `2006-01-02 15:04:05` |

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/history?limit=20&type=clipboard&tag=AI"
```

**响应示例**

```json
[
  {
    "id": "20260521183000_a1b2c3d4",
    "content": "剪贴板内容预览...",
    "type": "clipboard",
    "timestamp": "2026-05-21 18:00:00",
    "nas_path": "/data/archive/2026/05/21/183000_剪贴板内容.md",
    "tags": ["AI", "技术"],
    "title": "剪贴板内容",
    "manual_edit": false
  }
]
```

### 1.3.2 GET /api/history/{id}

获取单条历史记录。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 历史条目 ID |

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/history/20260521183000_a1b2c3d4"
```

**响应示例**

```json
{
  "id": "20260521183000_a1b2c3d4",
  "content": "完整内容预览...",
  "type": "clipboard",
  "timestamp": "2026-05-21 18:00:00",
  "nas_path": "/data/archive/2026/05/21/183000_剪贴板内容.md",
  "tags": ["AI"],
  "title": "剪贴板内容",
  "publish_summary": "摘要...",
  "manual_edit": false
}
```

### 1.3.3 PUT /api/history/{id}

更新历史记录的标题、标签或摘要。

**请求体**

```json
{
  "title": "新标题",
  "tags": ["AI", "技术", "已发布"],
  "summary": "新摘要"
}
```

**示例**

```bash
curl -X PUT -u "admin:secret" "https://knowly.want.biz/api/history/20260521183000_a1b2c3d4" \
  -H "Content-Type: application/json" \
  -d '{"title": "深度分析", "tags": ["AI", "深度"]}'
```

**响应**

```json
{ "status": "saved", "manual_edit": true }
```

### 1.3.4 GET /api/history/{id}/full

获取完整内容（如本地只有预览，会从 NAS 读取全文）。

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/history/20260521183000_a1b2c3d4/full"
```

**响应示例**

```json
{ "content": "完整的 Markdown 内容，包含 frontmatter 和正文..." }
```

### 1.3.5 POST /api/history/{id}/reprocess

重新对该条目运行 AI 处理（生成标签、摘要、评分等）。

**无请求体**

**示例**

```bash
curl -X POST -u "admin:secret" "https://knowly.want.biz/api/history/20260521183000_a1b2c3d4/reprocess"
```

**响应示例**

```json
{
  "status": "processing",
  "title": "重新处理后的标题",
  "tags": ["AI", "新标签"],
  "summary": "新摘要",
  "score": 8
}
```

### 1.3.6 GET /api/tags

返回所有标签及使用次数。

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/tags"
```

**响应示例**

```json
[
  { "name": "AI", "count": 42 },
  { "name": "技术", "count": 15 },
  { "name": "哲学", "count": 7 }
]
```

---

## 1.4 发布 API

### 1.4.1 POST /api/publish

发布内容到指定渠道。

**请求体**

```json
{
  "content": "要发布的内容正文...",
  "targets": ["blog", "ima", "kindle", "podcast"]
}
```

**示例**

```bash
curl -X POST -u "admin:secret" "https://knowly.want.biz/api/publish" \
  -H "Content-Type: application/json" \
  -d '{"content": "# 标题\n\n正文内容", "targets": ["blog"]}'
```

**响应示例**

```json
[
  { "target": "blog", "ok": true },
  { "target": "ima", "ok": false, "error": "IMA 配置不完整" },
  { "target": "kindle", "ok": true }
]
```

### 1.4.2 POST /api/tag-and-publish

为已有历史条目添加标签并发布到指定渠道。

**请求体**

```json
{
  "id": "20260521183000_a1b2c3d4",
  "tag": "待发布",
  "target": "blog"
}
```

`target` 可选：`blog`, `podcast`, `ima`, `kindle`

**示例**

```bash
curl -X POST -u "admin:secret" "https://knowly.want.biz/api/tag-and-publish" \
  -H "Content-Type: application/json" \
  -d '{"id": "20260521183000_a1b2c3d4", "tag": "发布队列", "target": "blog"}'
```

**响应示例**

```json
{
  "tag_added": true,
  "target": "blog",
  "published": true
}
```

---

## 1.5 搜索 API

### 1.5.1 GET /api/search

在远程 NAS 归档中搜索内容。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `q` | string | 是 | 搜索关键词 |
| `limit` | int | 否 | 返回条数，默认 50 |

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/search?q=量化交易&limit=20"
```

**响应示例**（取决于 SSH 远程执行 `grep` 的结果）

```json
[
  {
    "file": "/data/archive/2026/04/18/142545_关于量化交易的思.md",
    "line": "关于量化交易的思考...",
    "context": "...量化交易的核心是..."
  }
]
```

---

## 1.6 统计 API

### 1.6.1 GET /api/stats

获取本地历史记录统计信息。

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/stats"
```

**响应示例**

```json
{ "total": 1234, "by_type": { "clipboard": 800, "sync": 434 } }
```

### 1.6.2 GET /api/status

获取守护进程运行状态。

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/status"
```

**响应示例**

```json
{
  "ssh": { "host": "nas.local", "user": "root", "port": "22", "base_path": "/data/archive" },
  "daemon_running": true,
  "total_syncs": 500,
  "ssh_connected": true,
  "start_time": "2026-05-21 10:00:00",
  "uptime": 28800,
  "pid": 12345,
  "version": "6.50.0",
  "publishers": {
    "blog": { "enabled": true },
    "podcast": { "enabled": false },
    "ima": { "enabled": true },
    "kindle": { "enabled": true }
  }
}
```

---

## 1.7 配置 API

### 1.7.1 GET /api/config/ai

获取当前 AI 配置（API Key 已脱敏）。

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/config/ai"
```

**响应示例**

```json
{
  "config": {
    "enabled": true,
    "api_key": "****abcd",
    "endpoint": "https://openrouter.ai/api/v1",
    "model": "anthropic/claude-sonnet-4-20250514",
    "preset": "openrouter",
    "timeout": 60,
    "min_content_len": 100,
    "max_content_len": 10000
  },
  "presets": { "openrouter": { "endpoint": "...", "model": "...", "label": "OpenRouter" } },
  "prompt_templates": { "default": "..." }
}
```

### 1.7.2 PUT /api/config/ai

更新 AI 配置。

**请求体**

```json
{
  "enabled": true,
  "api_key": "sk-newkey",
  "endpoint": "https://openrouter.ai/api/v1",
  "model": "anthropic/claude-sonnet-4-20250514",
  "timeout": 60,
  "min_content_len": 100,
  "max_content_len": 10000
}
```

> 若 `api_key` 传空值或脱敏值（`****` 开头），保留原 key。

**示例**

```bash
curl -X PUT -u "admin:secret" "https://knowly.want.biz/api/config/ai" \
  -H "Content-Type: application/json" \
  -d '{"enabled": true, "model": "gpt-4"}'
```

**响应**

```json
{ "status": "saved" }
```

### 1.7.3 GET /api/config

获取完整配置（敏感字段自动脱敏）。

**示例**

```bash
curl -u "admin:secret" "https://knowly.want.biz/api/config"
```

**响应**: 完整 JSON 配置对象（略）。

### 1.7.4 PUT /api/config

更新完整配置。

**请求体**: 完整配置 JSON 对象。建议先 GET 获取当前配置，修改所需字段后再 PUT 回传。

**示例**

```bash
curl -X PUT -u "admin:secret" "https://knowly.want.biz/api/config" \
  -H "Content-Type: application/json" \
  -d '{"ssh": {"host": "new-host.com", "port": "22"}, "web": {"auth": "newuser:newpass"}}'
```

**响应**

```json
{ "status": "saved" }
```

---

## 1.8 管理 API

> 注意：管理操作（restart/update/release）不应并发调用。

### 1.8.1 POST /api/admin/restart

重启守护进程。

**示例**

```bash
curl -X POST -u "admin:secret" "https://knowly.want.biz/api/admin/restart"
```

**响应**

```json
{ "status": "restarting" }
```

### 1.8.2 POST /api/admin/update

从源码重新编译、替换二进制文件并重启。返回 SSE 流。

**示例**

```bash
curl -X POST -u "admin:secret" "https://knowly.want.biz/api/admin/update"
```

**响应 (SSE)**

```
data: {"step":"building","message":"正在编译..."}

data: {"step":"replacing","message":"替换二进制文件"}

data: {"step":"done","message":"更新完成"}
```

### 1.8.3 POST /api/admin/release

版本发布流程：git commit → git push → npm version minor → git push --tags。返回 SSE 流。

**示例**

```bash
curl -X POST -u "admin:secret" "https://knowly.want.biz/api/admin/release"
```

**响应 (SSE)**

```
data: {"step":"commit","message":"提交代码..."}
data: {"step":"push","message":"推送..."}
data: {"step":"version","message":"升级版本号"}
data: {"step":"tags","message":"推送标签"}
data: {"step":"done","message":"发布完成"}
```

---

## 1.9 文件上传 API

### 1.9.1 POST /api/upload

上传文件到远程 NAS（通过 SSH）。

**Content-Type:** `multipart/form-data`

**Form 字段**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `file` | File | 是 | 上传的文件 |

**大小限制:** 200MB

**特殊处理:** `.txt` 或 `.md` 文件会自动触发 AI 处理、归档写入、历史索引和自动发布。非文本文件仅保存到 `uploads/` 目录，不触发后续处理。

**示例**

```bash
curl -X POST -u "admin:secret" "https://knowly.want.biz/api/upload" \
  -F "file=@/home/user/report.md"
```

**响应示例**

```json
{
  "status": "ok",
  "filename": "report.md",
  "saved_as": "report_20260528_143022.md",
  "path": "/data/archive/uploads/report_20260528_143022.md",
  "size": 12345
}
```

### 1.9.2 GET /api/uploads/download

从 `uploads` 目录下载文件。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `filename` | string | 是 | 文件名（仅 basename，不支持路径） |

**示例**

```bash
curl -G -u "admin:secret" "https://knowly.want.biz/api/uploads/download" \
  -d "filename=report.md" -o report.md
```

**响应**: 文件二进制流。若文件不存在，返回 JSON 错误。

---

## 1.10 前端页面

### 1.10.1 GET /

Web 管理界面，单页应用。

**示例**

浏览器打开 `https://knowly.want.biz/` 即可。

---

# 2. WeClaw API

**Base URL:**  
- 内网：`http://127.0.0.1:18011`  
- 公网（主动发送）：`https://wx.want.biz`

**认证:** 默认无认证。公网 `https://wx.want.biz/api/send` 当前无需认证。内网 API 建议仅监听 `127.0.0.1`。

---

## 2.1 消息发送

### 2.1.1 POST /api/send

向指定微信用户发送消息（支持文本、图片、文件）。

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `to` | string | 是 | 微信用户 ID，格式 `xxx@im.wechat` |
| `text` | string | 否 | 文本消息内容，支持 markdown（会转纯文本） |
| `media_url` | string | 否 | 图片/视频/文件的公网 URL |

> `text` 和 `media_url` 至少提供一个，可同时提供。

**示例 1：发送纯文本**

```bash
curl -X POST https://wx.want.biz/api/send \
  -H "Content-Type: application/json" \
  -d '{"to":"o9cq80wpGQpRIUxH2LGdGFrksGak@im.wechat","text":"Hello from WeClaw"}'
```

**示例 2：发送图片**

```bash
curl -X POST https://wx.want.biz/api/send \
  -H "Content-Type: application/json" \
  -d '{"to":"o9cq80wpGQpRIUxH2LGdGFrksGak@im.wechat","media_url":"https://example.com/photo.png"}'
```

**示例 3：同时发送文本和图片**

```bash
curl -X POST https://wx.want.biz/api/send \
  -H "Content-Type: application/json" \
  -d '{"to":"user@im.wechat","text":"查看图片","media_url":"https://example.com/photo.png"}'
```

**响应（成功）**

```json
{"status": "ok"}
```

**响应（失败）**: HTTP 500 + 错误信息文本。

---

## 2.2 服务状态与配置

### 2.2.1 GET /api/status

获取服务运行状态。

**示例**

```bash
curl http://127.0.0.1:18011/api/status
```

**响应示例**

```json
{
  "running": true,
  "pid": 12345,
  "uptime": "2h30m",
  "agent_count": 3,
  "account_count": 1,
  "hub_files": 5,
  "default_agent": "claude",
  "version": "v2.3.1"
}
```

### 2.2.2 GET /api/config

获取当前配置（敏感信息隐藏）。

**示例**

```bash
curl http://127.0.0.1:18011/api/config
```

**响应示例**

```json
{
  "default_agent": "claude",
  "api_addr": "127.0.0.1:18011",
  "save_dir": "/Users/xxx/Documents/weclaw-saves",
  "agents": { ... }
}
```

### 2.2.3 PUT /api/config

更新配置。

**请求体**: 完整配置对象。

**示例**

```bash
curl -X PUT http://127.0.0.1:18011/api/config \
  -H "Content-Type: application/json" \
  -d '{"default_agent": "codex", "api_addr": "0.0.0.0:18011"}'
```

**响应**

```json
{ "status": "saved" }
```

---

## 2.3 Agent 管理

### 2.3.1 GET /api/agents

列出所有已配置的 Agent。

**示例**

```bash
curl http://127.0.0.1:18011/api/agents
```

**响应示例**

```json
[
  {
    "name": "claude",
    "type": "acp",
    "command": "/usr/local/bin/claude-agent-acp",
    "model": "sonnet",
    "aliases": ["cc", "ai"]
  },
  {
    "name": "codex",
    "type": "acp",
    "command": "/usr/local/bin/codex-acp",
    "aliases": ["cx"]
  }
]
```

### 2.3.2 POST /api/agents

添加新 Agent。

**请求体**

```json
{
  "name": "gpt",
  "type": "http",
  "endpoint": "https://api.openai.com/v1/chat/completions",
  "api_key": "sk-xxx",
  "model": "gpt-4o",
  "aliases": ["4o"]
}
```

**示例**

```bash
curl -X POST http://127.0.0.1:18011/api/agents \
  -H "Content-Type: application/json" \
  -d '{"name":"gpt","type":"http","endpoint":"https://api.openai.com/v1/chat/completions","api_key":"sk-xxx"}'
```

**响应**

```json
{ "status": "added" }
```

### 2.3.3 PUT /api/agents/{name}

更新 Agent 配置。

**示例**

```bash
curl -X PUT http://127.0.0.1:18011/api/agents/claude \
  -H "Content-Type: application/json" \
  -d '{"model": "opus"}'
```

**响应**

```json
{ "status": "updated" }
```

### 2.3.4 DELETE /api/agents/{name}

删除 Agent。

**示例**

```bash
curl -X DELETE http://127.0.0.1:18011/api/agents/gpt
```

**响应**

```json
{ "status": "deleted" }
```

### 2.3.5 POST /api/agents/detect

自动检测系统中已安装的 Agent。

**示例**

```bash
curl -X POST http://127.0.0.1:18011/api/agents/detect
```

**响应示例**

```json
{
  "detected": ["claude", "codex", "gemini"],
  "added": ["claude", "codex"]
}
```

---

## 2.4 账号与登录

### 2.4.1 GET /api/accounts

列出已登录的微信账号。

**示例**

```bash
curl http://127.0.0.1:18011/api/accounts
```

**响应示例**

```json
[
  {
    "id": "o9cq80wpGQpRIUxH2LGdGFrksGak@im.wechat",
    "bot_token": "****",
    "ilink_bot_id": "wx123456@im.wechat.com"
  }
]
```

### 2.4.2 DELETE /api/accounts/{id}

删除账号凭证。

**示例**

```bash
curl -X DELETE http://127.0.0.1:18011/api/accounts/o9cq80wpGQpRIUxH2LGdGFrksGak%40im.wechat
```

**响应**

```json
{ "status": "deleted" }
```

### 2.4.3 GET /api/login/qrcode

获取登录二维码。

**示例**

```bash
curl http://127.0.0.1:18011/api/login/qrcode
```

**响应示例**

```json
{
  "qrcode": "https://...",
  "qrcode_img_content": "base64..."
}
```

### 2.4.4 GET /api/login/status

轮询登录状态（需要携带 `qrcode` 参数）。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `qrcode` | string | 是 | 二维码内容 |

**示例**

```bash
curl "http://127.0.0.1:18011/api/login/status?qrcode=xxx"
```

**响应示例**

```json
{
  "status": "confirmed",
  "redirect_host": "",
  "bot_token": "xxx",
  "ilink_bot_id": "xxx"
}
```

可能的 status：`wait`、`scaned`、`confirmed`、`expired`、`scaned_but_redirect`、`binded_redirect`。

---

## 2.5 Hub 共享文件

### 2.5.1 GET /api/hub

列出 Hub 共享文件（简要列表）。

**示例**

```bash
curl http://127.0.0.1:18011/api/hub
```

**响应示例**

```json
[
  "pipe_20260528_gemini.md",
  "analysis_claude.md"
]
```

### 2.5.2 GET /api/hub/{filename}

读取指定共享文件内容。

**示例**

```bash
curl http://127.0.0.1:18011/api/hub/pipe_20260528_gemini.md
```

**响应**: 文件内容（Markdown + frontmatter）。

### 2.5.3 POST /api/hub

保存内容到 Hub（需在请求体中提供 `filename` 和 `content`）。

**请求体**

```json
{
  "filename": "my_note.md",
  "content": "正文内容"
}
```

**示例**

```bash
curl -X POST http://127.0.0.1:18011/api/hub \
  -H "Content-Type: application/json" \
  -d '{"filename":"test.md","content":"Hello"}'
```

**响应**

```json
{ "status": "saved", "path": "test.md" }
```

### 2.5.4 DELETE /api/hub/{filename}

删除指定共享文件。

**示例**

```bash
curl -X DELETE http://127.0.0.1:18011/api/hub/test.md
```

**响应**

```json
{ "status": "deleted" }
```

### 2.5.5 DELETE /api/hub?clear=true

清空所有共享文件。

**示例**

```bash
curl -X DELETE "http://127.0.0.1:18011/api/hub?clear=true"
```

**响应**

```json
{ "status": "cleared", "count": 5 }
```

---

## 2.6 待办、定时器、定时任务

### 2.6.1 待办事项

#### GET /api/todos

列出待办事项。

**示例**

```bash
curl http://127.0.0.1:18011/api/todos
```

**响应示例**

```json
[
  {
    "id": 1,
    "user_id": "user@im.wechat",
    "title": "买牛奶",
    "due_time": 1715680000,
    "status": 0,
    "created_at": 1715670000,
    "reminded": false
  }
]
```

#### POST /api/todos

添加待办。

**请求体**

```json
{
  "title": "写报告",
  "due_time": 1715680000
}
```

**示例**

```bash
curl -X POST http://127.0.0.1:18011/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"写报告","due_time":1715680000}'
```

**响应**

```json
{ "status": "added", "id": 2 }
```

#### PUT /api/todos/{id}/done

标记待办为完成。

**示例**

```bash
curl -X PUT http://127.0.0.1:18011/api/todos/1/done
```

**响应**

```json
{ "status": "done" }
```

#### DELETE /api/todos/{id}

删除待办。

**示例**

```bash
curl -X DELETE http://127.0.0.1:18011/api/todos/1
```

**响应**

```json
{ "status": "deleted" }
```

### 2.6.2 定时器

#### GET /api/timers

列出活跃定时器。

**示例**

```bash
curl http://127.0.0.1:18011/api/timers
```

**响应示例**

```json
[
  {
    "id": 1,
    "user_id": "user@im.wechat",
    "label": "开会",
    "duration": 1800,
    "end_time": 1715681800,
    "status": 0
  }
]
```

#### POST /api/timers

创建定时器。

**请求体**

```json
{
  "label": "休息一下",
  "duration": 300
}
```

**示例**

```bash
curl -X POST http://127.0.0.1:18011/api/timers \
  -H "Content-Type: application/json" \
  -d '{"label":"休息","duration":300}'
```

**响应**

```json
{ "status": "started", "id": 2, "end_time": 1715681800 }
```

#### PUT /api/timers/{id}/cancel

取消定时器。

**示例**

```bash
curl -X PUT http://127.0.0.1:18011/api/timers/1/cancel
```

**响应**

```json
{ "status": "cancelled" }
```

### 2.6.3 定时任务 (Cron)

#### GET /api/cron

列出所有定时任务。

**示例**

```bash
curl http://127.0.0.1:18011/api/cron
```

**响应示例**

```json
{
  "jobs": [
    {
      "id": "cron_1775672695739713860",
      "user_id": "user@im.wechat",
      "cron_expr": "0 9 * * *",
      "command": { "type": "text", "content": "早安" },
      "enabled": true,
      "created_at": 1715670000,
      "next_run": 1715680800
    }
  ]
}
```

#### POST /api/cron

添加定时任务。

**请求体**

```json
{
  "cron_expr": "0 9 * * *",
  "type": "text",
  "content": "早上好"
}
```

`type` 可选：`text`、`workflow`、`agent`。若为 `agent` 需指定 `agent` 字段。

**示例**

```bash
curl -X POST http://127.0.0.1:18011/api/cron \
  -H "Content-Type: application/json" \
  -d '{"cron_expr":"0 9 * * *","type":"text","content":"早安"}'
```

**响应**

```json
{ "status": "added", "id": "cron_xxx" }
```

#### DELETE /api/cron/{id}

删除定时任务。

**示例**

```bash
curl -X DELETE http://127.0.0.1:18011/api/cron/cron_1775672695739713860
```

**响应**

```json
{ "status": "deleted" }
```

#### PUT /api/cron/{id}/enable

启用定时任务。

**示例**

```bash
curl -X PUT http://127.0.0.1:18011/api/cron/cron_xxx/enable
```

**响应**

```json
{ "status": "enabled" }
```

#### PUT /api/cron/{id}/disable

禁用定时任务。

**示例**

```bash
curl -X PUT http://127.0.0.1:18011/api/cron/cron_xxx/disable
```

**响应**

```json
{ "status": "disabled" }
```

---

## 2.7 服务控制

### 2.7.1 POST /api/service/restart

重启 WeClaw 服务。

**示例**

```bash
curl -X POST http://127.0.0.1:18011/api/service/restart
```

**响应**

```json
{ "status": "restarting" }
```

### 2.7.2 POST /api/service/update

在线更新 WeClaw 到最新版本。

**示例**

```bash
curl -X POST http://127.0.0.1:18011/api/service/update
```

**响应**

```json
{ "status": "updating" }
```

实际更新过程会在后台执行，可查看日志。

---

## 2.8 健康检查与日志

### 2.8.1 GET /health

健康检查。

**示例**

```bash
curl http://127.0.0.1:18011/health
```

**响应**

```json
{ "status": "ok" }
```

### 2.8.2 GET /api/logs

获取服务日志（最近 N 行）。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `lines` | int | 否 | 行数，默认 200，最大 2000 |

**示例**

```bash
curl "http://127.0.0.1:18011/api/logs?lines=100"
```

**响应**: 纯文本日志内容。

---

## 2.9 管理后台

### 2.9.1 GET /admin

Web 管理后台界面。

**示例**

浏览器打开 `http://127.0.0.1:18011/admin`。

---

# 3. knasync API

**Base URL:**  
- `https://knasync.want.biz`  
- `https://knasync.yuanguangshan.workers.dev`

**认证:** 除 `/health` 和 `/` 外，所有请求需在 Header 中携带 `X-Auth-Key: <your-secret-key>`。

---

## 3.1 健康检查

### 3.1.1 GET /health

无需认证。检测 D1 数据库连接状态。

**示例**

```bash
curl https://knasync.want.biz/health
```

**响应示例**

```json
{
  "ok": true,
  "ts": 1715680000000,
  "db": "connected"
}
```

---

## 3.2 提交内容

### 3.2.1 POST /submit

提交内容到队列。系统自动分类（知乎/微信/通用），并做 5 分钟去重。

**请求体**支持 JSON 或纯文本。

**JSON 格式**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `content` 或 `url` | string | 是 | 要提交的内容 |
| `queue` | string | 否 | 手动指定队列：`zhihu`, `wechat`, `general` |

**示例 1：提交 URL（自动分类）**

```bash
curl -X POST https://knasync.want.biz/submit \
  -H "X-Auth-Key: your-key" \
  -H "Content-Type: application/json" \
  -d '{"content": "https://zhuanlan.zhihu.com/p/123456"}'
```

**响应**

```
OK (zhihu)
```

**示例 2：手动指定队列**

```bash
curl -X POST https://knasync.want.biz/submit \
  -H "X-Auth-Key: your-key" \
  -H "Content-Type: application/json" \
  -d '{"content": "一些普通文本", "queue": "general"}'
```

**响应**

```
OK (general)
```

**示例 3：纯文本提交**

```bash
curl -X POST https://knasync.want.biz/submit \
  -H "X-Auth-Key: your-key" \
  -H "Content-Type: text/plain" \
  -d 'https://zhuanlan.zhihu.com/p/123456'
```

**响应**

```
OK (zhihu)
```

**去重命中时响应**

```
Duplicate ignored (zhihu)
```

**错误响应**

- 内容为空：`400 Bad Request`
- 认证失败：`401 Unauthorized`

---

## 3.3 拉取队列

### 3.3.1 GET /pull

从指定队列拉取所有内容并删除。不传 `queue` 时按优先级回退（zhihu → wechat → general）。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `queue` | string | 否 | 队列名称：`zhihu`, `wechat`, `general`，也支持带 `queue_` 前缀 |

**示例**

```bash
curl -H "X-Auth-Key: your-key" "https://knasync.want.biz/pull?queue=general"
```

**响应（有内容）**: `200 OK`，返回 JSON 数组

```json
["https://example.com/article1", "普通文本内容"]
```

**响应（空队列）**: `204 No Content`

---

## 3.4 查看队列（只读）

### 3.4.1 GET /peek

只读查看队列内容，不删除。不传 `queue` 时返回所有队列详情。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `queue` | string | 否 | 队列名称，不传则返回全部 |

**示例 1：查看所有队列**

```bash
curl -H "X-Auth-Key: your-key" "https://knasync.want.biz/peek"
```

**响应示例**

```json
{
  "total": 5,
  "queues": {
    "zhihu": [
      { "content": "https://zhuanlan.zhihu.com/p/123", "queue_type": "zhihu", "created_at": 1715680000 }
    ],
    "wechat": [],
    "general": [
      { "content": "普通文本", "queue_type": "general", "created_at": 1715680005 }
    ]
  }
}
```

**示例 2：查看单个队列**

```bash
curl -H "X-Auth-Key: your-key" "https://knasync.want.biz/peek?queue=zhihu"
```

**响应**（仅列出该队列的内容数组）

```json
[
  { "content": "https://zhuanlan.zhihu.com/p/123", "queue_type": "zhihu", "created_at": 1715680000 }
]
```

**空队列响应**: `204 No Content`

---

## 3.5 推送结果

### 3.5.1 POST /push

消费者处理完毕后将结果推入广播队列（results 表）。

**请求体**支持 JSON 或纯文本。

**JSON 格式**

```json
{
  "content": "处理后的内容（Markdown 等）"
}
```

**示例**

```bash
curl -X POST https://knasync.want.biz/push \
  -H "X-Auth-Key: your-key" \
  -H "Content-Type: application/json" \
  -d '{"content": "# 文章标题\n\n正文内容"}'
```

**响应（成功）**: `200 OK`，纯文本 `OK`

**错误**: `400` 内容为空，`401` 认证失败。

---

## 3.6 获取结果

### 3.6.1 GET /results

增量拉取广播结果，支持游标分页。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `since` | number | 否 | 时间戳游标，只返回 `created_at > since` 的记录 |
| `limit` | number | 否 | 返回数量，默认 50，最大 50 |

**示例**

```bash
curl -H "X-Auth-Key: your-key" "https://knasync.want.biz/results?since=1715680000&limit=10"
```

**响应**

```json
{
  "cursor": 1715680010,
  "items": [
    { "t": 1715680005, "c": "处理后的内容1" },
    { "t": 1715680010, "c": "处理后的内容2" }
  ]
}
```

- `cursor` 是最新条目的时间戳，可作为下次请求的 `since` 值。
- 若没有新结果，返回 `{"cursor": 0, "items": []}`。

---

## 3.7 清空数据

### 3.7.1 POST /clear

**危险操作**：清空 `queue` 和 `results` 表所有记录。调试/维护用。

**示例**

```bash
curl -X POST -H "X-Auth-Key: your-key" "https://knasync.want.biz/clear"
```

**响应**

```json
{ "ok": true }
```

---

## 3.8 API 文档

### 3.8.1 GET /

返回 API 文档概览。

**无需认证**

**示例**

```bash
curl https://knasync.want.biz/
```

**响应示例**

```json
{
  "name": "knasync",
  "description": "内容队列分发系统，基于 Cloudflare Workers + D1 数据库",
  "endpoints": {
    "GET /": "返回此 API 文档与端点概览",
    "GET /health": "健康检查",
    "POST /submit": "提交内容到队列",
    "GET /peek": "只读查看队列",
    "GET /pull": "拉取队列内容",
    "POST /push": "推送处理结果",
    "GET /results": "读取广播结果",
    "POST /clear": "清空数据"
  },
  "authentication": "除 GET /health 和 GET / 外，需携带 X-Auth-Key",
  "queues": ["zhihu", "wechat", "general"]
}
```

---

# 4. 附录

## 4.1 全局认证说明

| 项目 | 认证方式 | 备注 |
|------|----------|------|
| Knowly | HTTP Basic Auth | 配置 `web.auth` 后启用，否则无需认证 |
| WeClaw | 默认无认证 | 内网监听 `127.0.0.1`，公网端点无认证（建议配合防火墙） |
| knasync | `X-Auth-Key` header | 所有需认证接口必须携带，密钥通过环境变量 `SECRET_KEY` 设置 |

## 4.2 常见错误码

| 状态码 | 含义 | 常见场景 |
|--------|------|----------|
| 200 | 成功 | – |
| 204 | 无内容 | 队列为空 / 无新日志 |
| 400 | 请求错误 | 缺少必填参数、内容为空 |
| 401 | 未授权 | 认证失败或缺少认证头 |
| 404 | 资源不存在 | 错误的 URL 或 ID |
| 405 | 方法不允许 | 使用了错误的 HTTP 方法 |
| 500 | 服务器内部错误 | 后端异常，需查看日志 |
| 503 | 服务不可用 | 依赖服务（如 SSH、数据库）不可达 |

---

*文档最后更新：2026-05-28*  
*涵盖项目：Knowly v6.50.0, WeClaw v2.3.1, knasync v1.0*
