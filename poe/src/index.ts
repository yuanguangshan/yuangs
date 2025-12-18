import { ExecutionContext, D1Database } from '@cloudflare/workers-types';

export interface Env {
    ASSETS: { fetch: (request: Request) => Promise<Response> };
    DB: D1Database;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        // API Proxy Logic
        if (url.pathname.startsWith('/api/')) {

            // --- History API ---
            if (url.pathname === '/api/history') {
                if (request.method === 'GET') {
                    const { results } = await env.DB.prepare(
                        "SELECT * FROM conversations ORDER BY timestamp DESC"
                    ).all();
                    return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
                }
                if (request.method === 'POST') {
                    const data = await request.json() as any;
                    // Create or update conversation
                    await env.DB.prepare(
                        "INSERT INTO conversations (id, title, model, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, model=excluded.model"
                    ).bind(data.id, data.title, data.model, data.timestamp).run();

                    // If messages provided, sync them (simple implementation: delete all and re-insert or just append new ones)
                    // For simplicity/robustness in this migration:
                    if (data.messages && Array.isArray(data.messages)) {
                        await env.DB.prepare("DELETE FROM messages WHERE conversation_id = ?").bind(data.id).run();
                        const stmt = env.DB.prepare("INSERT INTO messages (conversation_id, role, content, raw_content, timestamp) VALUES (?, ?, ?, ?, ?)");
                        const batch = data.messages.map((msg: any) => stmt.bind(data.id, msg.role, msg.content, msg.rawContent, msg.timestamp || Date.now()));
                        await env.DB.batch(batch);
                    }

                    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
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

                    return new Response(JSON.stringify({ ...conv, messages: results }), { headers: { 'Content-Type': 'application/json' } });
                }
                if (request.method === 'DELETE') {
                    await env.DB.prepare("DELETE FROM messages WHERE conversation_id = ?").bind(id).run();
                    await env.DB.prepare("DELETE FROM conversations WHERE id = ?").bind(id).run();
                    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
                }
            }

            // --- Proxy to Upstream ---
            const targetUrl = new URL(url.pathname.replace('/api/', '/'), 'https://api.yuangs.cc');

            // Copy query parameters
            url.searchParams.forEach((value, key) => {
                targetUrl.searchParams.append(key, value);
            });

            const proxyRequest = new Request(targetUrl.toString(), {
                method: request.method,
                headers: request.headers,
                body: request.body,
                redirect: 'follow'
            });

            try {
                const response = await fetch(proxyRequest);
                const newHeaders = new Headers(response.headers);
                newHeaders.set('Access-Control-Allow-Origin', '*');

                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: { message: `Proxy error: ${e}` } }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }
        }

        // Serve static assets from the 'public' directory
        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        }

        return new Response("Not Found", { status: 404 });
    },
};
