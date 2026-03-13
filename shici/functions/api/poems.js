// functions/api/poems.js
// Cloudflare Pages Function - 诗词数据 API

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
  };
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

// GET /api/poems
export async function onRequestGet(context) {
  const { env } = context;

  // 1. 检查 KV 绑定是否存在
  if (!env.POETRY_KV) {
    return new Response(JSON.stringify({ error: 'KV_BINDING_MISSING', message: 'POETRY_KV is not bound to Pages Functions.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  try {
    const data = await env.POETRY_KV.get('poems', { type: 'json' });

    // 2. 如果数据为空，返回具体的状态而不是悄悄返回 []
    if (data === null) {
      return new Response(JSON.stringify({ error: 'DATA_EMPTY', message: 'No data found in KV under "poems" key.' }), {
        status: 200, // 仍然返回200但带有错误消息
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...corsHeaders(),
        },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache', // 调试期禁用缓存
        'X-Debug-Source': 'KV-SUCCESS',
        ...corsHeaders(),
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'KV_READ_ERROR', message: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
}

// PUT /api/poems
export async function onRequestPut(context) {
    const { request, env } = context;
    const token = request.headers.get('X-Admin-Token');
    const expectedToken = env.ADMIN_TOKEN;

    if (!expectedToken) {
        return new Response(JSON.stringify({ error: 'ADMIN_TOKEN_NOT_SET' }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders() } 
        });
    }

    if (!token || token !== expectedToken) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { 
            status: 403, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders() } 
        });
    }

    try {
        const data = await request.json();
        await env.POETRY_KV.put('poems', JSON.stringify(data));
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders() } 
        });
    }
}
