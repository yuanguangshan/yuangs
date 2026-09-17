// KK 词典 API 代理：把 uapis.cn 的词典查询/每日一词代理到 dict.want.biz/api/uapi/* 下，
// 解决浏览器跨域限制，并加边缘缓存。
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const isLookup = url.pathname.startsWith('/api/uapi/lookup');
    const isDaily = url.pathname.startsWith('/api/uapi/daily');
    const isAudio = url.pathname.startsWith('/api/uapi/audio');
    if (!isLookup && !isDaily && !isAudio) {
      return new Response('Not Found', { status: 404 });
    }

    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (isDaily) {
      return handleDaily(ctx);
    }

    if (isAudio) {
      return handleAudio(url, ctx);
    }

    const word = (url.searchParams.get('word') || '').trim().toLowerCase();
    if (!/^[a-z][a-z'-]{0,30}$/.test(word)) {
      return json({ found: false, error: 'invalid word' });
    }

    const cache = caches.default;
    const cacheKey = new Request(`https://cache.dict.want.biz/lookup?word=${word}`, { method: 'GET' });
    let res = await cache.match(cacheKey);
    if (res) return res;

    const upstream = await fetch(
      `https://uapis.cn/api/v1/dictionary/lookup?word=${encodeURIComponent(word)}`,
      { headers: { 'User-Agent': 'kk-dict-proxy/1.0' } }
    );
    if (!upstream.ok) {
      return json({ found: false, error: `upstream ${upstream.status}` }, 502);
    }
    const data = await upstream.json();
    res = json(data);
    res.headers.set('Cache-Control', 'public, max-age=86400');
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  },
};

// 发音音频代理：流式转发 MP3，边缘缓存 30 天
async function handleAudio(url, ctx) {
  const word = (url.searchParams.get('word') || '').trim().toLowerCase();
  const accent = (url.searchParams.get('accent') || 'us').toLowerCase();
  if (!/^[a-z][a-z'-]{0,30}$/.test(word) || !['uk', 'us'].includes(accent)) {
    return new Response('Bad Request', { status: 400 });
  }

  const cache = caches.default;
  const cacheKey = new Request(`https://cache.dict.want.biz/audio?word=${word}&accent=${accent}`, { method: 'GET' });
  let res = await cache.match(cacheKey);
  if (res) return res;

  const upstream = await fetch(
    `https://uapis.cn/api/v1/dictionary/audio?word=${encodeURIComponent(word)}&accent=${accent}`,
    { headers: { 'User-Agent': 'kk-dict-proxy/1.0' } }
  );
  if (!upstream.ok) {
    return new Response('Upstream Error', { status: 502 });
  }
  res = new Response(upstream.body, {
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') || 'audio/mpeg',
      'Cache-Control': 'public, max-age=2592000',
      'Access-Control-Allow-Origin': '*',
    },
  });
  ctx.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}

// 每日一词：按天缓存（上游按日期换词）
async function handleDaily(ctx) {
  const cache = caches.default;
  const cacheKey = new Request('https://cache.dict.want.biz/daily', { method: 'GET' });
  let res = await cache.match(cacheKey);
  if (res) return res;

  const upstream = await fetch('https://uapis.cn/api/v1/daily/word', {
    headers: { 'User-Agent': 'kk-dict-proxy/1.0' },
  });
  if (!upstream.ok) {
    return json({ error: `upstream ${upstream.status}` }, 502);
  }
  const data = await upstream.json();
  res = json(data);
  res.headers.set('Cache-Control', 'public, max-age=600');
  ctx.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
  });
}
