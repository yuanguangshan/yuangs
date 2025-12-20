import { ExecutionContext, D1Database } from '@cloudflare/workers-types';

export interface Env {
    ASSETS: { fetch: (request: Request) => Promise<Response> };
    DB: D1Database;
}

// 提取公共 CORS 头部
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS, DELETE, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

// 辅助函数：返回 JSON 响应
const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
};

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        const { pathname } = url;

        // 1. 处理 API 路由
        if (pathname.startsWith('/api/') || pathname.startsWith('/v1/')) {

            // 处理跨域预检
            if (request.method === 'OPTIONS') {
                return new Response(null, { headers: corsHeaders });
            }

            // --- 历史记录 API (/api/history) ---
            if (pathname.replace(/\/$/, '') === '/api/history') {
                try {
                    // 【优化】获取列表：增加 LIMIT 50，避免读取行数随对话增加而爆炸
                    if (request.method === 'GET') {
                        const { results } = await env.DB.prepare(
                            "SELECT id, title, model, created_at FROM conversations ORDER BY created_at DESC LIMIT 50"
                        ).all();
                        return jsonResponse(results.map((c: any) => ({ ...c, timestamp: c.created_at })));
                    }

                    // 【优化】保存对话：使用 batch 提升写入性能
                    if (request.method === 'POST') {
                        const data = await request.json() as any;
                        if (!data.id) return jsonResponse({ error: "Missing ID" }, 400);

                        const batch = [];
                        const timestamp = data.timestamp || Date.now();

                        // 插入或更新对话主表
                        batch.push(
                            env.DB.prepare(
                                "INSERT INTO conversations (id, title, model, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, model=excluded.model"
                            ).bind(data.id, data.title || 'New Chat', data.model || 'GPT-4o-mini', timestamp)
                        );

                        // 如果传了消息列表，则同步
                        if (data.messages && Array.isArray(data.messages)) {
                            // 删除旧消息（依靠之前建立的索引，这里会非常快）
                            batch.push(env.DB.prepare("DELETE FROM messages WHERE conversation_id = ?").bind(data.id));

                            const stmt = env.DB.prepare("INSERT INTO messages (conversation_id, role, content, raw_content, timestamp, model) VALUES (?, ?, ?, ?, ?, ?)");
                            data.messages.forEach((msg: any) => {
                                batch.push(stmt.bind(data.id, msg.role, msg.content, msg.rawContent || '', msg.timestamp || timestamp, msg.model || null));
                            });
                        }

                        await env.DB.batch(batch);
                        return jsonResponse({ success: true });
                    }
                } catch (e) {
                    return jsonResponse({ error: `DB Error: ${e}` }, 500);
                }
            }

            // --- 历史记录详情 API (/api/history/:id) ---
            if (pathname.startsWith('/api/history/')) {
                const id = pathname.split('/').pop();

                // 【优化】获取详情：使用 Promise.all 并行查询，减少 Worker 等待时间
                if (request.method === 'GET') {
                    const [msgResult, conv] = await Promise.all([
                        env.DB.prepare("SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC").bind(id).all(),
                        env.DB.prepare("SELECT * FROM conversations WHERE id = ?").bind(id).first()
                    ]);
                    return jsonResponse({ ...conv, messages: msgResult.results });
                }

                if (request.method === 'DELETE') {
                    await env.DB.batch([
                        env.DB.prepare("DELETE FROM messages WHERE conversation_id = ?").bind(id),
                        env.DB.prepare("DELETE FROM conversations WHERE id = ?").bind(id)
                    ]);
                    return jsonResponse({ success: true });
                }

                if (request.method === 'PATCH') {
                    const data = await request.json() as any;
                    if (!data.title) return jsonResponse({ error: "Missing title" }, 400);
                    await env.DB.prepare("UPDATE conversations SET title = ? WHERE id = ?").bind(data.title, id).run();
                    return jsonResponse({ success: true });
                }
            }

            // --- API 代理逻辑 (/v1/...) ---
            let targetPath = pathname;
            if (targetPath.startsWith('/api/v1/')) {
                targetPath = targetPath.replace('/api/', '/');
            }

            if (!targetPath.startsWith('/v1/')) {
                return jsonResponse({ error: `Route not found: ${pathname}` }, 404);
            }

            const targetUrl = new URL(targetPath, 'https://api.yuangs.cc');
            url.searchParams.forEach((value, key) => targetUrl.searchParams.append(key, value));

            const proxyHeaders = new Headers(request.headers);
            ['Host', 'Referer', 'Origin', 'cf-connecting-ip'].forEach(h => proxyHeaders.delete(h));

            try {
                const response = await fetch(targetUrl.toString(), {
                    method: request.method,
                    headers: proxyHeaders,
                    body: request.body,
                    redirect: 'follow'
                });

                const newHeaders = new Headers(response.headers);
                // 覆盖目标服务器可能存在的 CORS 限制
                Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));

                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                });
            } catch (e) {
                return jsonResponse({ error: { message: `Proxy error: ${e}` } }, 500);
            }
        }

        // 2. 静态资源处理
        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        }

        return new Response("Not Found", { status: 404 });
    },
};