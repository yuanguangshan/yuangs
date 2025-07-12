// src/worker.js (Merged, Final Version - CORRECTED)

/*
 * 这个 `worker.js` 文件是 Cloudflare Worker 的入口点，它扮演着“前台总机”的角色。
 * 它的主要职责是：
 * 1. 处理全局性的、与特定聊天室无关的API请求（如AI服务、文件上传）。
 * 2. 识别出与特定聊天室相关的请求（无论是API还是WebSocket），并将它们准确地转发给对应的Durable Object实例。
 * 3. 响应定时触发器（Cron Triggers），并调度Durable Object执行定时任务。
 * 4. 为用户提供初始的HTML页面。
 */
// src/worker.js

// --- ✨ 核心修正：添加 polyfill 来定义 global ---
// Cloudflare Workers环境没有`global`，但有些npm包（如echarts）会依赖它。
// 我们在这里创建一个全局的 `global` 变量，并让它指向Worker环境的全局对象 `self`。
globalThis.global = globalThis;


import { HibernatingChatRoom } from './chatroom_do.js';
import html from '../public/index.html';
import managementHtml from '../public/management.html';
import { generateAndPostCharts } from './chart_generator.js';
import { taskMap } from './autoTasks.js';
import { getDeepSeekExplanation, getGeminiExplanation, getGeminiImageDescription } from './ai.js';

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

// --- AI Service Functions are now in src/ai.js ---
// 文件: src/worker.js

/**
 * 独立的、顶级的辅助函数，用于向指定的房间发送自动帖子。
 * @param {object} env 环境变量
 * @param {string} roomName 要发帖的房间名
 * @param {string} text 帖子的内容
 * @param {object} ctx 执行上下文，用于 waitUntil
 */
async function sendAutoPost(env, roomName, text, ctx) {
    console.log(`Dispatching auto-post to room: ${roomName} via RPC`);
    try {
        if (!env.CHAT_ROOM_DO) {
            throw new Error("Durable Object 'CHAT_ROOM_DO' is not bound.");
        }
        
        const doId = env.CHAT_ROOM_DO.idFromName(roomName);
        const stub = env.CHAT_ROOM_DO.get(doId);

        // 【重大修改】从 fetch 调用改为 RPC 调用
        // 使用传入的 ctx.waitUntil 来确保 RPC 调用执行完毕
        ctx.waitUntil(stub.cronPost(text, env.CRON_SECRET));

        console.log(`Successfully dispatched auto-post RPC to room: ${roomName}`);
    } catch (error) {
        console.error(`Error in sendAutoPost for room ${roomName}:`, error.stack || error);
    }
}




// --- 主Worker入口点 ---
// 在 worker.js 的 fetch 函数中

export default {
    async fetch(request, env, ctx) {
        try {
            if (request.method === 'OPTIONS') {
                return handleOptions(request);
            }

            const url = new URL(request.url);
            const pathname = url.pathname;

            // --- 路由 1: 全局独立API (不需转发) ---

                
            // --- ✨ 新增：管理页面路由 ---
            if (pathname === '/management') {
                // 从环境变量中获取房间列表，如果未设置则提供默认值
                const roomsListString = env.MANAGEMENT_ROOMS_LIST || 'general,test,future,admin,kerry';
                const roomsArray = roomsListString.split(',').map(room => room.trim()); // 分割并去除空格

                // 将房间列表注入到 HTML 字符串中
                // 我们在 HTML 中放置一个特殊的注释占位符，然后替换它
                let modifiedHtml = managementHtml.replace(
                    '/* MANAGEMENT_ROOMS_LIST_PLACEHOLDER */',
                    `const potentialRoomsToCheck = ${JSON.stringify(roomsArray)};`
                );
                if (env.API_DOMAIN) {
                    modifiedHtml = modifiedHtml.replace(
                        '/* API_DOMAIN_PLACEHOLDER */',
                        `const apiDomain = "${env.API_DOMAIN}";`
                    );
                }

                return new Response(modifiedHtml, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
            }

            // --- ✨ 新增：用户管理API路由转发 ---
            if (pathname.startsWith('/api/users/')) {
                const roomName = url.searchParams.get('roomName');
                if (!roomName) {
                    return new Response('API request requires a roomName parameter', { status: 400 });
                }
                const doId = env.CHAT_ROOM_DO.idFromName(roomName);
                const stub = env.CHAT_ROOM_DO.get(doId);
                // 将原始请求转发给DO，让DO内部处理
                return await stub.fetch(request);
            }
        
            
            // 将所有全局API的判断合并到一个if/else if结构中
            if (pathname === '/upload') {
                // --- ✨ 这是唯一且正确的 /upload 处理逻辑 ✨ ---
                // (基于您提供的“改进版”代码，并修正了key的使用)
                if (request.method !== 'POST') {
                    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
                }
                try {
                    if (!env.R2_BUCKET) {
                        throw new Error('Server config error: R2_BUCKET not bound.');
                    }
                    
                    const filenameHeader = request.headers.get('X-Filename');
                    if (!filenameHeader) {
                        throw new Error('Missing X-Filename header');
                    }
                    
                    const filename = decodeURIComponent(filenameHeader);
                    const contentType = request.headers.get('Content-Type') || 'application/octet-stream';
                    
                    // 正确生成包含目录的、唯一的R2对象Key
                    const r2ObjectKey = `chating/${Date.now()}-${crypto.randomUUID().substring(0, 8)}-${filename}`;
                    
                    // 使用正确的key上传到R2
                    const object = await env.R2_BUCKET.put(r2ObjectKey, request.body, {
                         httpMetadata: { contentType: contentType },
                    });
                    
                    // 生成与存储路径完全匹配的公开URL
                    // const r2PublicDomain = "pub-8dfbdda6df204465aae771b4c080140b.r2.dev";
                    const r2PublicDomain = "https://pic.want.biz";
                    const publicUrl = `${r2PublicDomain}/${object.key}`; // object.key 现在是 "chating/..."
                    
                    return new Response(JSON.stringify({ url: publicUrl }), {
                        headers: { 'Content-Type': 'application/json', ...corsHeaders },
                    });

                } catch (error) {
                    console.error('R2 Upload error:', error.stack || error);
                    return new Response(`Error uploading file: ${error.message}`, { 
                        status: 500, 
                        headers: corsHeaders 
                    });
                }

            } else if (pathname === '/ai-explain') {
                // ... /ai-explain 的逻辑 ...
                const { text, model = 'gemini' } = await request.json();
                if (!text) return new Response('Missing "text"', { status: 400, headers: corsHeaders });

                // 修正：移除硬编码的prompt，直接使用传入的text
                const fullPrompt = `你是一位非常耐心的小学老师，专门给小学生讲解新知识。  我是一名小学三年级学生，我特别渴望弄明白事物的含义。  请你用精准、详细的语言解释（Markdown 格式）：1. 用通俗易懂的语言解释下面这段文字。2. 给出关键概念的定义。3. 用生活中的比喻或小故事帮助理解。4. 举一个具体例子，并示范“举一反三”的思考方法。5. 最后用一至两个问题来引导我延伸思考。:\n\n${text}`;
                
                const explanation = model === 'gemini' 
                    ? await getGeminiExplanation(fullPrompt, env) 
                    : await getDeepSeekExplanation(fullPrompt, env);

                return new Response(JSON.stringify({ explanation }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });

            } else if (pathname === '/ai-describe-image') {
                // ... /ai-describe-image 的逻辑 ...
                const { imageUrl } = await request.json();
                if (!imageUrl) return new Response('Missing "imageUrl"', { status: 400, headers: corsHeaders });
                const description = await getGeminiImageDescription(imageUrl, env);
                return new Response(JSON.stringify({ description }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
            }

            // --- 路由 2: 需要转发给 DO 的 API ---
            // 明确列出所有需要转发的API路径前缀
            if (pathname.startsWith('/api/')) {
                let roomName;
                // 对于这些API，房间名在查询参数里
                if (pathname.startsWith('/api/messages') || pathname.startsWith('/api/reset-room')|| pathname.startsWith('/api/debug')|| pathname.startsWith('/api/room')) {
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
     * 【重构后】处理由Cron Trigger触发的定时事件。
     */
async scheduled(event, env, ctx) {
        console.log(`[Worker] 🚀🚀🚀🚀 Cron Trigger firing! Rule: ${event.cron}🚀🚀🚀`);

        const taskFunction = taskMap.get(event.cron);

        if (taskFunction) {
            console.log(`[Worker] 🧮 Executing task for cron rule: ${event.cron}`);
            
            // 【关键修改】: 执行任务并获取返回的状态结果
            const result = await taskFunction(env, ctx);
            
            // 如果任务函数返回了结果，就进行广播通知
            if (result && result.roomName) {
                try {
                    const doId = env.CHAT_ROOM_DO.idFromName(result.roomName);
                    const stub = env.CHAT_ROOM_DO.get(doId);
                    
                    // 准备要广播的系统消息内容
                    const systemMessagePayload = result.success 
                        ? { message: `✅ 定时任务'${event.cron}'执行成功: ${result.message}`, level: 'SUCCESS' }
                        : { message: `❌ 定时任务'${event.cron}'执行失败: ${result.error}`, level: 'ERROR', data: result };

                    // 调用新的RPC方法来广播通知
                    // 同样使用 waitUntil 确保它在后台完成
                    ctx.waitUntil(stub.broadcastSystemMessage(systemMessagePayload, env.CRON_SECRET));

                } catch(e) {
                    console.error(`[Worker] Failed to broadcast cron status for room ${result.roomName}:`, e);
                }
            }

        } else {
            console.warn(`[Worker] No task defined for cron rule: ${event.cron}`);
        }
    },
};
