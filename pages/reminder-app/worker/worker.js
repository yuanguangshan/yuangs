// worker.js
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runCron(env));
  },
};

// --------- Utilities ---------

const JSON_RESPONSE = (data, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,DELETE,OPTIONS",
      "access-control-allow-headers": "content-type",
      ...extraHeaders,
    },
  });

function notFound(msg = "Not found") {
  return JSON_RESPONSE({ error: msg }, 404);
}

function badRequest(msg = "Bad request") {
  return JSON_RESPONSE({ error: msg }, 400);
}

async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,DELETE,OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
      },
    });
  }

  try {
    if (pathname === "/api/vapidPublicKey" && request.method === "GET") {
      return JSON_RESPONSE({ key: env.VAPID_PUBLIC_KEY });
    }

    if (pathname === "/api/subscribe" && request.method === "POST") {
      const body = await safeJson(request);
      if (!body) return badRequest("Invalid JSON");
      const { deviceId, subscription } = body;
      if (!deviceId || !subscription?.endpoint || !subscription?.keys?.auth || !subscription?.keys?.p256dh) {
        return badRequest("Missing deviceId or subscription");
      }
      const now = Date.now();
      
      // 添加调试日志
      console.log("Subscription data:", { deviceId, endpoint: subscription.endpoint, auth: subscription.keys.auth, p256dh: subscription.keys.p256dh, now });
      
      // Upsert by endpoint using prepare and bind
      try {
        // 检查参数是否有效
        if (!deviceId || !subscription.endpoint || !subscription.keys.auth || !subscription.keys.p256dh) {
          console.error("Missing required subscription data");
          return badRequest("Missing required subscription data");
        }
        
        // 使用 prepare 和 bind 方法
        const stmt = env.reminderDB.prepare(`
          INSERT INTO subscriptions (device_id, endpoint, auth, p256dh, created_at)
          VALUES (?1, ?2, ?3, ?4, ?5)
          ON CONFLICT(endpoint) DO UPDATE SET
            device_id=excluded.device_id,
            auth=excluded.auth,
            p256dh=excluded.p256dh
        `);
        
        const result = await stmt.bind(deviceId, subscription.endpoint, subscription.keys.auth, subscription.keys.p256dh, now).run();
        console.log("Database insert result:", result);
        return JSON_RESPONSE({ ok: true });
      } catch (e) {
        console.error("Database error:", e);
        return JSON_RESPONSE({ error: "Database error: " + e.message }, 500);
      }
    }

    if (pathname === "/api/reminders" && request.method === "POST") {
      const body = await safeJson(request);
      if (!body) return badRequest("Invalid JSON");
      const { deviceId, title, content, dueAt } = body;
      if (!deviceId || !title || !Number.isFinite(dueAt)) {
        return badRequest("Missing deviceId/title/dueAt");
      }
      const now = Date.now();
      if (dueAt < now - 60000) {
        return badRequest("dueAt is in the past");
      }
      const result = await env.reminderDB.prepare(
        `INSERT INTO reminders (device_id, title, body, due_at, nudge_sent, deleted, created_at)
         VALUES (?1, ?2, ?3, ?4, 0, 0, ?5)`
      ).bind(deviceId, title, content || "", dueAt, now).run();
      return JSON_RESPONSE({ ok: true, id: result.lastRowId });
    }

    if (pathname === "/api/reminders" && request.method === "GET") {
      const deviceId = searchParams.get("deviceId");
      if (!deviceId) return badRequest("Missing deviceId");
      const rows = await env.reminderDB.prepare(
        `SELECT id, title, body, due_at AS dueAt, nudge_sent AS nudgeSent, delivered_at AS deliveredAt, deleted
         FROM reminders
         WHERE device_id=?1 AND deleted=0
         ORDER BY due_at ASC`
      ).bind(deviceId).all();
      return JSON_RESPONSE({ items: rows.results || [] });
    }

    if (pathname.startsWith("/api/reminders/") && request.method === "DELETE") {
      const idStr = pathname.split("/").pop();
      const id = Number(idStr);
      const deviceId = searchParams.get("deviceId");
      if (!id || !deviceId) return badRequest("Missing id or deviceId");
      await env.reminderDB.prepare(
        `UPDATE reminders SET deleted=1 WHERE id=?1 AND device_id=?2`
      ).bind(id, deviceId).run();
      return JSON_RESPONSE({ ok: true });
    }

    if (pathname === "/api/due" && request.method === "GET") {
      // SW 在收到 push 时，用自身订阅 endpoint 拉取到期提醒
      const endpoint = searchParams.get("endpoint");
      if (!endpoint) return badRequest("Missing endpoint");
      const sub = await env.reminderDB.prepare(
        `SELECT device_id FROM subscriptions WHERE endpoint=?1`
      ).bind(endpoint).get();
      if (!sub) return notFound("Subscription not found");
      const now = Date.now();
      // 查询未删除、未标记 delivered 的到期提醒
      const rows = await env.reminderDB.prepare(
        `SELECT id, title, body, due_at AS dueAt
         FROM reminders
         WHERE device_id=?1 AND deleted=0 AND due_at<=?2 AND delivered_at IS NULL`
      ).bind(sub.device_id, now).all();

      const ids = (rows.results || []).map(r => r.id);
      if (ids.length > 0) {
        const placeholders = ids.map(() => "?").join(",");
        await env.reminderDB.prepare(
          `UPDATE reminders SET delivered_at=?1 WHERE id IN (${placeholders})`
        ).bind(now, ...ids).run();
      }
      return JSON_RESPONSE({ items: rows.results || [] });
    }

    return notFound();
  } catch (err) {
    console.error("Error:", err);
    return JSON_RESPONSE({ error: String(err?.message || err) }, 500);
  }
}

async function safeJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// --------- Cron: find due reminders and send empty push ---------

async function runCron(env) {
  const now = Date.now();

  // 找到有到期未推送的设备订阅 endpoint
  const endpoints = await env.reminderDB.prepare(
    `SELECT DISTINCT s.endpoint, s.device_id
     FROM subscriptions s
     WHERE EXISTS (
       SELECT 1 FROM reminders r
       WHERE r.device_id = s.device_id
         AND r.deleted=0
         AND r.delivered_at IS NULL
         AND r.due_at <= ?1
         AND (r.nudge_sent=0 OR r.nudge_sent IS NULL)
     )`
  ).bind(now).all();

  const list = endpoints.results || [];
  if (!list.length) return;

  // 预导入 VAPID 私钥
  const vapid = await getVapidSigner(env);

  for (const row of list) {
    const endpoint = row.endpoint;
    try {
      const headers = await buildVapidHeaders(vapid, endpoint, env.VAPID_PUBLIC_KEY, env.VAPID_SUBJECT);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...headers,
          TTL: "60",
        },
        // 空载荷
      });

      if (res.status === 404 || res.status === 410) {
        // 订阅失效，清理
        await env.reminderDB.prepare(`DELETE FROM subscriptions WHERE endpoint=?1`).bind(endpoint).run();
        continue;
      }

      if (res.ok || res.status === 201 || res.status === 202) {
        // 将这台设备的到期提醒标记已推送（避免重复推送）
        await env.reminderDB.prepare(
          `UPDATE reminders SET nudge_sent=1
           WHERE device_id=?1 AND deleted=0 AND delivered_at IS NULL AND due_at<=?2`
        ).bind(row.device_id, now).run();
      } else {
        console.warn("Push send failed", endpoint, res.status, await safeText(res));
      }
    } catch (e) {
      console.error("Push error", endpoint, e);
    }
  }
}

async function safeText(res) {
  try { return await res.text(); } catch { return ""; }
}

// --------- VAPID helpers ---------

let cachedVapidKey = null;
async function getVapidSigner(env) {
  if (cachedVapidKey) return cachedVapidKey;
  // 私钥用 JWK 存在环境变量 VAPID_PRIVATE_JWK（通过 wrangler secret 设置）
  const jwk = JSON.parse(env.VAPID_PRIVATE_JWK);
  const privateKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );
  cachedVapidKey = { privateKey };
  return cachedVapidKey;
}

async function buildVapidHeaders(vapid, endpoint, publicKeyB64Url, subject) {
  const origin = new URL(endpoint).origin;
  const exp = Math.floor(Date.now() / 1000) + 12 * 60 * 60; // 12h
  const header = b64url(JSON.stringify({ typ: "JWT", alg: "ES256" }));
  const payload = b64url(JSON.stringify({ aud: origin, exp, sub: subject }));
  const input = new TextEncoder().encode(`${header}.${payload}`);
  const derSig = new Uint8Array(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    vapid.privateKey,
    input
  ));
  const sigB64Url = derToJoseB64Url(derSig);
  const jwt = `${header}.${payload}.${sigB64Url}`;

  return {
    Authorization: `vapid t=${jwt}, k=${publicKeyB64Url}`,
    "Crypto-Key": `p256ecdsa=${publicKeyB64Url}`,
  };
}

function b64url(input) {
  let bytes;
  if (typeof input === "string") bytes = new TextEncoder().encode(input);
  else if (input instanceof Uint8Array) bytes = input;
  else if (input instanceof ArrayBuffer) bytes = new Uint8Array(input);
  else throw new Error("Unsupported b64url input");
  let str = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    str += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  let b64 = btoa(str);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

// Convert DER ECDSA signature to JOSE (R||S) base64url
function derToJoseB64Url(der) {
  // Minimal ASN.1 parser for ECDSA signature: SEQ -> INT(R) + INT(S)
  let i = 0;
  if (der[i++] !== 0x30) throw new Error("Invalid DER: no sequence");
  let seqLen = der[i++];
  if (seqLen & 0x80) {
    const n = seqLen & 0x7f;
    seqLen = 0;
    for (let j = 0; j < n; j++) seqLen = (seqLen << 8) | der[i++];
  }
  if (der[i++] !== 0x02) throw new Error("Invalid DER: no int R");
  let rLen = der[i++];
  while (der[i] === 0x00 && rLen > 32) { i++; rLen--; } // strip leading zeros
  const r = der.slice(i, i + rLen); i += rLen;
  if (der[i++] !== 0x02) throw new Error("Invalid DER: no int S");
  let sLen = der[i++];
  while (der[i] === 0x00 && sLen > 32) { i++; sLen--; }
  const s = der.slice(i, i + sLen); i += sLen;

  const out = new Uint8Array(64);
  out.set(r.length === 32 ? r : leftPad32(r), 0);
  out.set(s.length === 32 ? s : leftPad32(s), 32);
  return b64url(out);
}

function leftPad32(arr) {
  const out = new Uint8Array(32);
  out.set(arr, 32 - arr.length);
  return out;
}