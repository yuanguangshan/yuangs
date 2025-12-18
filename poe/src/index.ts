import { ExecutionContext, D1Database } from '@cloudflare/workers-types';

export interface Env {
    ASSETS: { fetch: (request: Request) => Promise<Response> };
    DB: D1Database;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        // API Proxy Logic
        if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/v1/')) {

            // Handle CORS Preflight for all API routes
            if (request.method === 'OPTIONS') {
                return new Response(null, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS, DELETE',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Max-Age': '86400',
                    }
                });
            }

            // --- History API ---
            // Allow optional trailing slash
            if (url.pathname.replace(/\/$/, '') === '/api/history') {
                try {
                    if (request.method === 'GET') {
                        const { results } = await env.DB.prepare(
                            "SELECT * FROM conversations ORDER BY created_at DESC"
                        ).all();
                        // Map created_at back to timestamp for frontend if needed, or frontend adapts
                        // The frontend expects 'timestamp' for sorting. Let's alias it or map it.
                        // Easier to just alias in SQL if supported, or map in JS.
                        // SQLite alias: SELECT *, created_at as timestamp ...
                        const fixedResults = results.map((c: any) => ({ ...c, timestamp: c.created_at }));
                        return new Response(JSON.stringify(fixedResults), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
                    }
                    if (request.method === 'POST') {
                        const data = await request.json() as any;

                        // Validate data
                        if (!data.id) {
                            return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
                        }

                        // Create or update conversation
                        await env.DB.prepare(
                            "INSERT INTO conversations (id, title, model, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, model=excluded.model"
                        ).bind(data.id, data.title || 'New Chat', data.model || 'GPT-4o-mini', data.timestamp || Date.now()).run();

                        // If messages provided, sync them using a transaction
                        if (data.messages && Array.isArray(data.messages)) {
                            const batch = [];
                            // 1. Delete existing messages
                            batch.push(env.DB.prepare("DELETE FROM messages WHERE conversation_id = ?").bind(data.id));

                            // 2. Insert new messages
                            const stmt = env.DB.prepare("INSERT INTO messages (conversation_id, role, content, raw_content, timestamp) VALUES (?, ?, ?, ?, ?)");
                            data.messages.forEach((msg: any) => {
                                batch.push(stmt.bind(data.id, msg.role, msg.content, msg.rawContent || '', msg.timestamp || Date.now()));
                            });

                            // Execute atomically
                            await env.DB.batch(batch);
                        }

                        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
                    }
                } catch (e) {
                    return new Response(JSON.stringify({ error: `DB Error: ${e}` }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
                }
            }

            if (url.pathname.startsWith('/api/history/')) {
                const id = url.pathname.split('/').pop();
                if (request.method === 'GET') {
                    const { results } = await env.DB.prepare(
                        "SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC"
                    ).bind(id).all();
                    // Fetch conv details too
                    const conv = await env.DB.prepare("SELECT * FROM conversations WHERE id = ?").bind(id).first();

                    return new Response(JSON.stringify({ ...conv, messages: results }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
                }
                if (request.method === 'DELETE') {
                    await env.DB.prepare("DELETE FROM messages WHERE conversation_id = ?").bind(id).run();
                    await env.DB.prepare("DELETE FROM conversations WHERE id = ?").bind(id).run();
                    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
                }
            }

            // --- Proxy to Upstream (/v1/...) ---
            // If it starts with /api/, we strip it (legacy/history). If /v1/, we leave it.
            let targetPath = url.pathname;
            if (targetPath.startsWith('/api/v1/')) {
                targetPath = targetPath.replace('/api/', '/');
            }

            // If it's the history API, we shouldn't be here (handled above),
            // but for safety, ensure we only proxy /v1/ calls to upstream.
            if (!targetPath.startsWith('/v1/')) {
                return new Response(JSON.stringify({ error: `Worker 404: Route not found or invalid proxy target: ${url.pathname}` }), { status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
            }

            const targetUrl = new URL(targetPath, 'https://api.yuangs.cc');

            // Copy query parameters
            url.searchParams.forEach((value, key) => {
                targetUrl.searchParams.append(key, value);
            });

            // Prepare headers for upstream
            const proxyHeaders = new Headers(request.headers);
            proxyHeaders.delete('Host'); // VALID: Allow fetch to set correct Host
            proxyHeaders.delete('Referer'); // Optional: Privacy
            proxyHeaders.delete('Origin'); // Optional: Let upstream see fetch origin

            const proxyRequest = new Request(targetUrl.toString(), {
                method: request.method,
                headers: proxyHeaders,
                body: request.body,
                redirect: 'follow'
            });

            try {
                const response = await fetch(proxyRequest);
                const newHeaders = new Headers(response.headers);

                // Re-write CORS headers for the client
                newHeaders.delete('Access-Control-Allow-Origin');
                newHeaders.set('Access-Control-Allow-Origin', '*');
                newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, DELETE');
                newHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: { message: `Proxy error: ${e}` } }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
            }
        }

        // Serve static assets from the 'public' directory
        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        }

        return new Response("Not Found", { status: 404 });
    },
};
