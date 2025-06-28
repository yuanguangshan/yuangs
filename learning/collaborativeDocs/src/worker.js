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