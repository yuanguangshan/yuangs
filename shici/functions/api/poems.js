// functions/api/poems.js
// Cloudflare Pages Function - 诗词数据 API
// 路由: /api/poems
// GET  → 读取诗词数据
// PUT  → 写入诗词数据（需要 Admin Token）

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
  };
}

// 处理 CORS 预检请求
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

// GET /api/poems → 返回诗词数据
export async function onRequestGet(context) {
  const { env } = context;

  try {
    // 从 KV 中读取诗词数据
    const data = await env.POETRY_KV.get('poems', { type: 'json' });

    return new Response(JSON.stringify(data || []), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
        ...corsHeaders(),
      },
    });
  } catch (e) {
    console.error('Error reading from KV:', e);
    return new Response(JSON.stringify([]), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...corsHeaders(),
      },
    });
  }
}

// PUT /api/poems → 保存诗词数据（需要认证）
export async function onRequestPut(context) {
  const { request, env } = context;

  // 验证 Admin Token
  const token = request.headers.get('X-Admin-Token');
  const expectedToken = env.ADMIN_TOKEN;

  if (!expectedToken) {
    return new Response(JSON.stringify({ error: 'ADMIN_TOKEN not configured on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  if (!token || token !== expectedToken) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  try {
    const data = await request.json();

    if (!Array.isArray(data)) {
      return new Response(JSON.stringify({ error: 'Data must be an array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      });
    }

    // 写入 KV
    await env.POETRY_KV.put('poems', JSON.stringify(data));

    return new Response(JSON.stringify({ success: true, count: data.length }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    });
  } catch (e) {
    console.error('Error writing to KV:', e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
}
