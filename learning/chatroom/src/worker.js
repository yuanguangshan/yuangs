// src/worker.js

import { ChatRoomDurableObject } from './chatroom_do.js';
import html from '../public/index.html';

// Export Durable Object class for Cloudflare platform instantiation
export { ChatRoomDurableObject };

// --- 新增：模块化的AI服务调用函数 ---

/**
 * 调用 DeepSeek API 获取解释
 * @param {string} text - 需要解释的文本
 * @param {object} env - Cloudflare环境变量
 * @returns {Promise<string>} - AI返回的解释文本
 */
async function getDeepSeekExplanation(text, env) {
    const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY) {
        throw new Error('Server configuration error: DEEPSEEK_API_KEY is not set.');
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "你是一个有用的，善于用简洁的markdown语言来解释下面的文本." },
                { role: "user", content: `你是一位非常耐心的小学老师，专门给小学生讲解新知识。  我是一名小学三年级学生，我特别渴望弄明白事物的含义。  请你用精准、详细的语言解释（Markdown 格式）：1. 用通俗易懂的语言解释下面这段文字。2. 给出关键概念的定义。3. 用生活中的比喻或小故事帮助理解。4. 举一个具体例子，并示范“举一反三”的思考方法。5. 最后用一至两个问题来引导我延伸思考。:\n\n${text}` }
            ]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`DeepSeek API error: ${response.status} - ${errorText}`);
        throw new Error(`DeepSeek API error: ${errorText}`);
    }

    const data = await response.json();
    const explanation = data?.choices?.[0]?.message?.content;

    if (!explanation) {
        console.error('Unexpected DeepSeek API response structure:', JSON.stringify(data));
        throw new Error('Unexpected AI response format from DeepSeek.');
    }

    return explanation;
}

/**
 * 调用 Google Gemini API 获取解释
 * @param {string} text - 需要解释的文本
 * @param {object} env - Cloudflare环境变量
 * @returns {Promise<string>} - AI返回的解释文本
 */
async function getGeminiExplanation(text, env) {
    const GEMINI_API_KEY = env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
        throw new Error('Server configuration error: GEMINI_API_KEY is not set.');
    }
    
    // Google Gemini API v1beta endpoint for text generation
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `你是一位非常耐心的小学老师，专门给小学生讲解新知识。  我是一名小学三年级学生，我特别渴望弄明白事物的含义。  请你用精准、详细的语言解释（Markdown 格式）：1. 用通俗易懂的语言解释下面这段文字。2. 给出关键概念的定义。3. 用生活中的比喻或小故事帮助理解。4. 举一个具体例子，并示范“举一反三”的思考方法。5. 最后用一至两个问题来引导我延伸思考。：:\n\n${text}`
                }]
            }]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error: ${response.status} - ${errorText}`);
        throw new Error(`Gemini API error: ${errorText}`);
    }

    const data = await response.json();
    // Gemini的响应结构不同，需要这样提取
    const explanation = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!explanation) {
        console.error('Unexpected Gemini API response structure:', JSON.stringify(data));
        throw new Error('Unexpected AI response format from Gemini.');
    }

    return explanation;
}


// --- 新增：AI图片描述服务 ---

async function fetchImageAsBase64(imageUrl) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();
    
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    
    return { base64, contentType };
}

async function getGeminiImageDescription(imageUrl, env) {
    const GEMINI_API_KEY = env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
        throw new Error('Server configuration error: GEMINI_API_KEY is not set.');
    }

    const { base64, contentType } = await fetchImageAsBase64(imageUrl);

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = "请仔细描述图片的内容，如果图片中识别出有文字，则在回复的内容中返回这些文字，并且这些文字支持复制，之后是对文字的仔细描述，格式为：图片中包含文字：{文字内容}；图片的描述：{图片描述}";

    const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: contentType,
                            data: base64
                        }
                    }
                ]
            }]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini Vision API error: ${response.status} - ${errorText}`);
        throw new Error(`Gemini Vision API error: ${errorText}`);
    }

    const data = await response.json();
    const description = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!description) {
        console.error('Unexpected Gemini Vision API response structure:', JSON.stringify(data));
        throw new Error('Unexpected AI response format from Gemini Vision.');
    }

    return description;
}


// --- 主Worker逻辑 ---

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
        let pathname = url.pathname;
        if (pathname.endsWith('/') && pathname.length > 1) {
            pathname = pathname.slice(0, -1);
        }
        const pathParts = pathname.split('/').filter(part => part);

        // Handle image upload (no changes here)
        if (pathname === '/upload' && request.method === 'POST') {
            // ... 你的上传逻辑保持不变 ...
            try {
                if (!env.R2_BUCKET) {
                    return new Response('Server configuration error: R2_BUCKET not bound.', { status: 500 });
                }
                const filename = request.headers.get('X-Filename') || `upload-${Date.now()}`;
                const object = await env.R2_BUCKET.put(filename, request.body, { httpMetadata: request.headers });
                const publicUrl = `${new URL(request.url).origin}/${object.key}`;
                return new Response(JSON.stringify({ url: publicUrl }), { headers: { 'Content-Type': 'application/json' } });
            } catch (error) {
                console.error('Upload error:', error.stack);
                return new Response('Error uploading file.', { status: 500 });
            }
        }

        // --- 更新后的AI解释请求处理逻辑 ---
        if (pathname === '/ai-explain' && request.method === 'POST') {
            try {
                const requestBody = await request.json();
                const text = requestBody.text;
                // 从请求中获取模型名称，如果前端没传，则默认为 'gemini'
                const model = requestBody.model || 'gemini'; 

                if (!text) {
                    return new Response('Missing text in request body.', { status: 400 });
                }

                let explanation = "";
                
                // 根据模型名称，调用相应的函数
                console.log(`Routing AI request to model: ${model}`);
                if (model === 'gemini') {
                    explanation = await getGeminiExplanation(text, env);
                } else if (model === 'deepseek') {
                    explanation = await getDeepSeekExplanation(text, env);
                } else {
                    return new Response(`Unknown AI model: ${model}`, { status: 400 });
                }

                return new Response(JSON.stringify({ explanation }), {
                    headers: { 'Content-Type': 'application/json' },
                });

            } catch (error) {
                console.error('AI explanation request error:', error.message);
                // 将具体的错误信息返回给前端，方便调试
                return new Response(`Error processing AI request: ${error.message}`, { status: 500 });
            }
        }

        // --- 新增：AI图片描述请求处理逻辑 ---
        if (pathname === '/ai-describe-image' && request.method === 'POST') {
            try {
                const requestBody = await request.json();
                const imageUrl = requestBody.imageUrl;

                if (!imageUrl) {
                    return new Response('Missing imageUrl in request body.', { status: 400 });
                }

                const description = await getGeminiImageDescription(imageUrl, env);

                return new Response(JSON.stringify({ description }), {
                    headers: { 'Content-Type': 'application/json' },
                });

            } catch (error) {
                console.error('AI image description request error:', error.message);
                return new Response(`Error processing AI image description request: ${error.message}`, { status: 500 });
            }
        }
        
        // --- 新增：获取房间用户统计数据的请求处理逻辑 ---
        if (pathname === '/room-user-stats' && request.method === 'GET') {
            try {
                const roomName = url.searchParams.get('roomName');
                if (!roomName) {
                    return new Response('Missing roomName in query parameters.', { status: 400 });
                }

                if (!env.CHAT_ROOM_DO) {
                    return new Response('Server configuration error: CHAT_ROOM_DO not bound.', { status: 500 });
                }
                const doId = env.CHAT_ROOM_DO.idFromName(roomName);
                const stub = env.CHAT_ROOM_DO.get(doId);

                // 向 Durable Object 发送内部请求获取统计数据
                const doResponse = await stub.fetch(new Request(`${url.origin}/user-stats`, { method: 'GET' }));
                
                if (!doResponse.ok) {
                    const errorText = await doResponse.text();
                    console.error(`Failed to fetch user stats from DO: ${doResponse.status} - ${errorText}`);
                    return new Response(`Error fetching user stats: ${errorText}`, { status: 500 });
                }

                const stats = await doResponse.json();
                return new Response(JSON.stringify(stats), {
                    headers: { 'Content-Type': 'application/json' },
                });

            } catch (error) {
                console.error('User stats request error:', error.message);
                return new Response(`Error processing user stats request: ${error.message}`, { status: 500 });
            }
        }
        
        // --- 剩余的路由逻辑保持不变 ---
        
        if (pathParts.length === 0) {
            return new Response('Welcome! Please access /<room-name> to join a chat room.', { status: 200 });
        }

        const roomName = pathParts[0];

        const upgradeHeader = request.headers.get("Upgrade");
        if (upgradeHeader === "websocket") {
            if (!env.CHAT_ROOM_DO) {
                return new Response('Server configuration error: CHAT_ROOM_DO not bound.', { status: 500 });
            }
            const doId = env.CHAT_ROOM_DO.idFromName(roomName);
            const stub = env.CHAT_ROOM_DO.get(doId);
            return stub.fetch(request);
        }

        return new Response(html, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
    },
};