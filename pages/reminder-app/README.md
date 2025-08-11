# 部署与使用步骤

## A) 生成 VAPID 密钥对

使用 web-push 库快速生成（一次性执行）：

```bash
npm i -g web-push
web-push generate-vapid-keys
```

或者使用浏览器控制台生成（参考 d1/README.md）。

收集到两个值：
- VAPID_PUBLIC_KEY（base64url，长度应为 86 字符左右）
- VAPID_PRIVATE_JWK（JSON）

## B) 创建与初始化 D1

```bash
wrangler d1 create reminders-db
```

将输出的 database_id 写入 wrangler.toml 的 database_id

初始化表结构：

```bash
wrangler d1 execute reminders-db --file=./schema/schema.sql
```

## C) 配置 wrangler.toml 并设置 secret

编辑 wrangler.toml：填入 VAPID_PUBLIC_KEY 与 VAPID_SUBJECT

设置私钥：

```bash
wrangler secret put VAPID_PRIVATE_JWK
```

粘贴步骤 A 得到的 JWK JSON

## D) 发布 Worker

```bash
wrangler deploy worker/worker.js --name reminder-worker --compatibility-date 2025-08-11
```

记录发布后的 Workers 域名，例如：https://reminder-worker.yuanguangshan.workers.dev

## E) 部署前端 Pages

新建 Cloudflare Pages 项目，选择"直接上传"或从仓库构建

上传 frontend/index.html（单文件即可）

部署完成后，打开页面，点击右上角"设置"，将 API 地址填为你的 Worker 地址（例如 https://reminder-worker.yuanguangshan.workers.dev），保存

点击"授权通知"，在浏览器授权

创建提醒，等待到点即可收到推送通知