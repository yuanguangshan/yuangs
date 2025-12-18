import { ExecutionContext } from '@cloudflare/workers-types';

export interface Env {
    ASSETS: { fetch: (request: Request) => Promise<Response> };
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        // API Proxy Logic
        if (url.pathname.startsWith('/api/')) {
            const targetUrl = new URL(url.pathname.replace('/api/', '/'), 'https://api.yuangs.cc');

            // Copy query parameters
            url.searchParams.forEach((value, key) => {
                targetUrl.searchParams.append(key, value);
            });

            // Create new request to target
            const proxyRequest = new Request(targetUrl.toString(), {
                method: request.method,
                headers: request.headers,
                body: request.body,
                redirect: 'follow'
            });

            // Ideally, we might want to strip/replace the Host header or others, 
            // but often fetch handles this. We might need to override origin/referer 
            // if the upstream checks strictly.
            // For now, let's try a simple pass-through.

            try {
                const response = await fetch(proxyRequest);

                // Re-create response to allow modifying headers if needed (CORS is handled by worker usually if same origin)
                // But since we are serving this from the SAME origin as the assets, we don't strictly need CORS headers 
                // on the response for our own frontend, but it's good practice to pass them through or set them.
                const newHeaders = new Headers(response.headers);
                newHeaders.set('Access-Control-Allow-Origin', '*'); // Or specific origin

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
