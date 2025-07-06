// src/worker.js (Merged, Final Version - CORRECTED)

/*
 * 这个 `worker.js` 文件是 Cloudflare Worker 的入口点，它扮演着“前台总机”的角色。
 * 它的主要职责是：
 * 1. 处理全局性的、与特定聊天室无关的API请求（如AI服务、文件上传）。
 * 2. 识别出与特定聊天室相关的请求（无论是API还是WebSocket），并将它们准确地转发给对应的Durable Object实例。
 * 3. 响应定时触发器（Cron Triggers），并调度Durable Object执行定时任务。
 * 4. 为用户提供初始的HTML页面。
 */
import { HibernatingChatRoom } from './chatroom_do.js';
import html from '../public/index.html';

// 导出Durable Object类，以便Cloudflare平台能够识别和实例化它。
export { HibernatingChatRoom };

// --- CORS (Cross-Origin Resource Sharing) Headers ---
// 这是一个可重用的对象，用于为API响应添加正确的CORS头部，允许跨域访问。
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // 生产环境建议替换为您的前端域名
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Filename',
    'Access-Control-Max-Age': '86400', // 预检请求的缓存时间
};

/**
 * 处理浏览器发送的CORS预检请求（OPTIONS方法）。
 */
function handleOptions(request) {
    if (
        request.headers.get('Origin') !== null &&
        request.headers.get('Access-Control-Request-Method') !== null &&
        request.headers.get('Access-Control-Request-Headers') !== null
    ) {
        return new Response(null, { headers: corsHeaders });
    } else {
        return new Response(null, { headers: { Allow: 'GET, HEAD, POST, OPTIONS' } });
    }
}

// --- AI Service Functions (Modularized) ---

/**
 * 调用 DeepSeek API 获取文本解释。
 */
async function getDeepSeekExplanation(text, env) {
    const apiKey = env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error('Server config error: DEEPSEEK_API_KEY is not set.');

    const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{ role: "system", content: "你是一个有用的，善于用简洁的markdown语言来解释下面的文本." }, { role: "user", content: `你是一位非常耐心的小学老师，专门给小学生讲解新知识。  我是一名小学三年级学生，我特别渴望弄明白事物的含义。  请你用精准、详细的语言解释（Markdown 格式）：1. 用通俗易懂的语言解释下面这段文字。2. 给出关键概念的定义。3. 用生活中的比喻或小故事帮助理解。4. 举一个具体例子，并示范“举一反三”的思考方法。5. 最后用一至两个问题来引导我延伸思考。:\n\n${text}` }]
        })
    });
    if (!response.ok) throw new Error(`DeepSeek API error: ${await response.text()}`);
    const data = await response.json();
    const explanation = data?.choices?.[0]?.message?.content;
    if (!explanation) throw new Error('Unexpected AI response format from DeepSeek.');
    return explanation;
}

/**
 * 调用 Google Gemini API 获取文本解释。
 */
async function getGeminiExplanation(text, env) {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Server config error: GEMINI_API_KEY is not set.');
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: `你是一位非常耐心的小学老师，专门给小学生讲解新知识。  我是一名小学三年级学生，我特别渴望弄明白事物的含义。  请你用精准、详细的语言解释（Markdown 格式）：1. 用通俗易懂的语言解释下面这段文字。2. 给出关键概念的定义。3. 用生活中的比喻或小故事帮助理解。4. 举一个具体例子，并示范“举一反三”的思考方法。5. 最后用一至两个问题来引导我延伸思考。：:\n\n${text}` }] }]
        })
    });
    if (!response.ok) throw new Error(`Gemini API error: ${await response.text()}`);
    const data = await response.json();
    const explanation = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!explanation) throw new Error('Unexpected AI response format from Gemini.');
    return explanation;
}

/**
 * 从URL获取图片并转换为Base64编码。
 */
async function fetchImageAsBase64(imageUrl) {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return { base64, contentType };
}

/**
 * 调用 Google Gemini API 获取图片描述。
 */
async function getGeminiImageDescription(imageUrl, env) {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Server config error: GEMINI_API_KEY is not set.');

    const { base64, contentType } = await fetchImageAsBase64(imageUrl);
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;
    const prompt = "请仔细描述图片的内容，如果图片中识别出有文字，则在回复的内容中返回这些文字，并且这些文字支持复制，之后是对文字的仔细描述，格式为：图片中包含文字：{文字内容}；图片的描述：{图片描述}";

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: contentType, data: base64 } }] }]
        })
    });
    if (!response.ok) throw new Error(`Gemini Vision API error: ${await response.text()}`);
    const data = await response.json();
    const description = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!description) throw new Error('Unexpected AI response format from Gemini Vision.');
    return description;
}

/**
 * 独立的、顶级的辅助函数，用于向指定的房间发送自动帖子。
 * @param {object} env 环境变量
 * @param {string} roomName 要发帖的房间名
 * @param {string} text 帖子的内容
 */
async function sendAutoPost(env, roomName, text) {
    console.log(`Sending auto-post to room: ${roomName}`);
    try {
        if (!env.CHAT_ROOM_DO) {
            throw new Error("Durable Object 'CHAT_ROOM_DO' is not bound.");
        }
        
        const doId = env.CHAT_ROOM_DO.idFromName(roomName);
        const stub = env.CHAT_ROOM_DO.get(doId);

        const response = await stub.fetch(new Request(`https://scheduler.internal/internal/auto-post`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                secret: env.CRON_SECRET
            })
        }));

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Auto-post failed: DO returned ${response.status} - ${errorText}`);
        }
        console.log(`Successfully sent auto-post to room: ${roomName}`);
    } catch (error) {
        console.error(`Error in sendAutoPost for room ${roomName}:`, error.stack || error);
    }
}


// --- 主Worker入口点 ---
export default {
    /**
     * 处理所有传入的HTTP请求。
     */// 文件: src/worker.js

    /**
     * 处理所有传入的HTTP请求。
     */
    async fetch(request, env, ctx) {
        try {
            if (request.method === 'OPTIONS') {
                return handleOptions(request);
            }

            const url = new URL(request.url);
            const pathname = url.pathname;

            // --- 路由 1: 全局独立API (不需转发) ---
            if (pathname === '/upload' || pathname === '/ai-explain' || pathname === '/ai-describe-image') {
                if (pathname === '/upload') {
                    if (!env.R2_BUCKET) return new Response('Server config error: R2_BUCKET not bound.', { status: 500 });
                    const filename = request.headers.get('X-Filename') || `upload-${Date.now()}`;
                    const object = await env.R2_BUCKET.put(filename, request.body, { httpMetadata: request.headers });
                    const publicUrl = `https://pub-8dfbdda6df204465aae771b4c080140b.r2.dev/${object.key}`;
                    return new Response(JSON.stringify({ url: publicUrl }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
                }
                if (pathname === '/ai-explain') {
                    const { text, model = 'gemini' } = await request.json();
                    if (!text) return new Response('Missing "text"', { status: 400, headers: corsHeaders });
                    const explanation = model === 'gemini' ? await getGeminiExplanation(text, env) : await getDeepSeekExplanation(text, env);
                    return new Response(JSON.stringify({ explanation }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
                }
                if (pathname === '/ai-describe-image') {
                    const { imageUrl } = await request.json();
                    if (!imageUrl) return new Response('Missing "imageUrl"', { status: 400, headers: corsHeaders });
                    const description = await getGeminiImageDescription(imageUrl, env);
                    return new Response(JSON.stringify({ description }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
                }
            }

            // --- 路由 2: 需要转发给 DO 的 API ---
            // 明确列出所有需要转发的API路径前缀
            if (pathname.startsWith('/api/')) {
                let roomName;
                // 对于这些API，房间名在查询参数里
                if (pathname.startsWith('/api/messages/history') || pathname.startsWith('/api/reset-room')) {
                    roomName = url.searchParams.get('roomName');
                }
                // (未来可以为其他API在这里添加 roomName 的获取逻辑)

                if (!roomName) {
                    return new Response('API request requires a roomName parameter', { status: 400 });
                }

                if (!env.CHAT_ROOM_DO) throw new Error("Durable Object 'CHAT_ROOM_DO' is not bound.");
                const doId = env.CHAT_ROOM_DO.idFromName(roomName);
                const stub = env.CHAT_ROOM_DO.get(doId);
                return stub.fetch(request); // 直接转发并返回DO的响应
            }

            // --- 路由 3: 房间页面加载 和 WebSocket 连接 ---
            // 匹配所有不以 /api/ 开头的路径，例如 /test, /general
            const pathParts = pathname.slice(1).split('/');
            const roomNameFromPath = pathParts[0];

            // 过滤掉空的路径部分和 favicon.ico 请求
            if (roomNameFromPath && roomNameFromPath !== 'favicon.ico') {
                 if (!env.CHAT_ROOM_DO) throw new Error("Durable Object 'CHAT_ROOM_DO' is not bound.");
                 const doId = env.CHAT_ROOM_DO.idFromName(roomNameFromPath);
                 const stub = env.CHAT_ROOM_DO.get(doId);
                 const response = await stub.fetch(request);

                 // 只有在DO明确要求时，才返回HTML
                 if (response.headers.get("X-DO-Request-HTML") === "true") {
                     return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
                 }
                 return response;
            }

            // --- 路由 4: 根路径 或 其他未匹配路径，直接返回HTML ---
            return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });

        } catch (e) {
            console.error("Critical error in main Worker fetch:", e.stack || e);
            return new Response("An unexpected error occurred.", { status: 500 });
        }
    },

    /**
     * 处理由Cron Trigger触发的定时事件。
     */
    async scheduled(event, env, ctx) {
        console.log(`Cron Trigger firing! Rule: ${event.cron}`);
        
        const tasks = [
            sendAutoPost(env, 'test', `Cron Trigger firing! Rule: ${event.cron}:苑：这是发送到房间的定时消息。`),
        ];
        
        ctx.waitUntil(Promise.allSettled(tasks));
     },
};