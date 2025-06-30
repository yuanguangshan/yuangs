// src/worker.js

import { ChatRoomDurableObject } from './chatroom_do.js';
import html from '../public/index.html';

// 导出 Durable Object 类，以便 Cloudflare 平台可以实例化它
export { ChatRoomDurableObject };

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(part => part);

        // 处理图片上传
        if (url.pathname === '/upload' && request.method === 'POST') {
            try {
                const filename = request.headers.get('X-Filename') || `upload-${Date.now()}`;
                const object = await env.R2_BUCKET.put(filename, request.body, {
                    httpMetadata: request.headers,
                });
                // 构造可公开访问的 URL
                const publicUrl = `${new URL(request.url).origin}/${object.key}`;
                return new Response(JSON.stringify({ url: publicUrl }), {
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                console.error('Upload error:', error);
                return new Response('Error uploading file.', { status: 500 });
            }
        }

        // 处理图片上传
        if (url.pathname === '/upload' && request.method === 'POST') {
            try {
                const filename = request.headers.get('X-Filename') || `upload-${Date.now()}`;
                const object = await env.R2_BUCKET.put(filename, request.body, {
                    httpMetadata: request.headers,
                });
                // 构造可公开访问的 URL
                const publicUrl = `${new URL(request.url).origin}/${object.key}`;
                return new Response(JSON.stringify({ url: publicUrl }), {
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                console.error('Upload error:', error);
                return new Response('Error uploading file.', { status: 500 });
            }
        }

        // 处理 AI 解释请求
        if (url.pathname === '/ai-explain' && request.method === 'POST') {
            try {
                const { text } = await request.json();
                if (!text) {
                    return new Response('Missing text in request body.', { status: 400 });
                }

                const GEMINI_API_KEY = env.GEMINI_API_KEY; // 从环境变量获取 API 密钥
                const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY;

                const geminiResponse = await fetch(GEMINI_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `解释以下文本：${text}`
                            }]
                        }]
                    })
                });

                if (!geminiResponse.ok) {
                    const errorText = await geminiResponse.text();
                    console.error('Gemini API error:', errorText);
                    return new Response(`Gemini API error: ${errorText}`, { status: geminiResponse.status });
                }

                const geminiData = await geminiResponse.json();
                const explanation = geminiData.candidates[0].content.parts[0].text;

                return new Response(JSON.stringify({ explanation }), {
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                console.error('AI explanation request error:', error);
                return new Response('Error processing AI explanation request.', { status: 500 });
            }
        }

        // 如果路径为空，引导用户访问一个房间
        if (pathParts.length === 0) {
            return new Response('Welcome! Please access /<room-name> to join a chat room.', { status: 404 });
        }

        // 使用第一个路径段作为聊天室的唯一ID
        const roomName = pathParts[0];

        // 检查请求是否是 WebSocket 升级请求
        const upgradeHeader = request.headers.get("Upgrade");
        if (upgradeHeader === "websocket") {
            // 如果是 WebSocket 请求，将其路由到对应的 Durable Object 实例
            console.log(`Routing WebSocket for room [${roomName}] to Durable Object...`);
            const doId = env.CHAT_ROOM_DO.idFromName(roomName);
            const stub = env.CHAT_ROOM_DO.get(doId);
            // 将请求和响应的控制权完全交给 Durable Object
            return stub.fetch(request);
        }

        // 对于所有非 WebSocket 的 GET 请求，返回我们的单页应用 HTML
        return new Response(html, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
    },
};