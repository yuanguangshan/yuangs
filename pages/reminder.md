下面给你一套可直接部署在 Cloudflare 全家桶（Workers + D1 + Cron Triggers + Pages）上的“网页提醒工具”。功能要点：

- 前端网页：创建提醒项（标题/内容/时间），查看/删除。
- 浏览器推送：使用 Push API + Service Worker。到点后由后台推送“空载荷”通知，SW 拉取到期提醒并弹出通知。
- 后端：Cloudflare Worker + D1 持久化。Cron 每分钟扫描到期提醒，向各设备的订阅 Endpoint 发送 Web Push（VAPID，无载荷）。
- 部署：前端可放在 Cloudflare Pages，后端是 Workers，数据库是 D1。全部代码与步骤如下。

重要说明与兼容性
- 推送依赖浏览器支持 Push API 与 Notification。Chrome/Edge/Firefox 桌面版均可；iOS 需 16.4+ 且 PWA 安装后才支持。
- 需要 HTTPS 域名。
- 我们采用“空载荷 Push + SW 拉取”的模式，极大简化了 Web Push 加密实现，Cloudflare Worker 里只需生成 VAPID JWT 并 POST 到订阅 endpoint 即可。

目录
1) 后端 Worker 代码（含路由与 Cron、VAPID）
2) D1 数据库 schema.sql
3) wrangler.toml（Workers 配置）
4) 前端 index.html（自包含，含 Service Worker 代码内联到 Blob）
5) 部署与使用步骤

1) Cloudflare Worker 代码（worker.js）
说明：
- /api/vapidPublicKey：前端获取 VAPID 公钥
- /api/subscribe：保存或更新 Push 订阅
- /api/reminders（POST/GET/DELETE）：创建/查询/删除提醒
- /api/due：SW 在 push 事件时，用订阅 endpoint 拉取到期提醒，并标记为 delivered
- Cron：每分钟扫描到点未推送的提醒，向相关 endpoint 发送空载荷 Push，并将 nudge_sent 置位
- 使用 D1 作为数据库
- CORS 默认允许所有来源（可按需收紧）

```js
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
      // Upsert by endpoint
      await env.reminderDB.exec(`
        INSERT INTO subscriptions (device_id, endpoint, auth, p256dh, created_at)
        VALUES (?1, ?2, ?3, ?4, ?5)
        ON CONFLICT(endpoint) DO UPDATE SET
          device_id=excluded.device_id,
          auth=excluded.auth,
          p256dh=excluded.p256dh
      `, [deviceId, subscription.endpoint, subscription.keys.auth, subscription.keys.p256dh, now]);
      return JSON_RESPONSE({ ok: true });
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
```

2) D1 数据库 schema.sql

```sql
-- schema.sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  auth TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  due_at INTEGER NOT NULL,             -- ms since epoch
  nudge_sent INTEGER NOT NULL DEFAULT 0,
  delivered_at INTEGER,                -- ms since epoch
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reminders_device ON reminders(device_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due ON reminders(due_at);
CREATE INDEX IF NOT EXISTS idx_reminders_pending ON reminders(device_id, due_at, nudge_sent, delivered_at, deleted);
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_endpoint ON subscriptions(endpoint);
```

3) wrangler.toml

说明：
- D1 绑定名 reminderDB
- Cron 每分钟执行
- VAPID_PUBLIC_KEY 和 VAPID_SUBJECT 放在 vars；VAPID_PRIVATE_JWK 用 secret 存（命令设置）
- compatibility_date 根据你当日设定

```toml
# wrangler.toml
name = "reminder-worker"
main = "worker.js"
compatibility_date = "2025-08-11"
workers_dev = true

[triggers]
crons = ["*/1 * * * *"]

[[d1_databases]]
binding = "reminderDB"
database_name = "reminders-db"
database_id = "<fill-after-create>"

[vars]
# 你的 VAPID 公钥（base64url，65字节未压缩公钥 0x04|x|y）
VAPID_PUBLIC_KEY = "<your_vapid_public_key_base64url>"
# 建议填你的站点或邮箱
VAPID_SUBJECT = "mailto:you@example.com"
```

设置私钥（JWK）为 secret：
- wrangler secret put VAPID_PRIVATE_JWK

4) 前端 index.html（可直接部署到 Cloudflare Pages）
特点：
- 响应式布局
- 内嵌 Service Worker 代码，以 Blob 注册（单文件自包含）
- 内置“API 地址设置”，可在 UI 中设置并存储在本地（方便指向 Worker 域名）
- 首次加载会申请通知权限、注册 SW、获取 VAPID 公钥并订阅 Push

请将它部署到 Pages（或任何静态托管），首次打开记得配置 API 地址为你的 Workers 域名（或绑定同域反代的 /api）。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
  <title>网页提醒工具</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #0b0c10;
      --card: #16181d;
      --text: #e5e7eb;
      --muted: #9aa3af;
      --brand: #4f46e5;
      --brand-2: #22c55e;
      --danger: #ef4444;
      --border: #2a2f3a;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: #f6f7fb;
        --card: #ffffff;
        --text: #111827;
        --muted: #6b7280;
        --border: #e5e7eb;
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      background: var(--bg); color: var(--text);
    }
    header {
      padding: 16px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px;
    }
    header h1 { font-size: 18px; margin: 0; }
    .container { max-width: 900px; margin: 0 auto; padding: 16px; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    @media (min-width: 740px) { .grid { grid-template-columns: 1fr 1fr; } }
    label { display: block; font-size: 14px; color: var(--muted); margin-bottom: 8px; }
    input[type="text"], textarea, input[type="datetime-local"] {
      width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 10px; background: transparent; color: var(--text);
      outline: none;
    }
    textarea { resize: vertical; min-height: 88px; }
    .row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .btn {
      padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border); background: transparent; color: var(--text); cursor: pointer;
    }
    .btn.primary { background: var(--brand); border-color: var(--brand); color: white; }
    .btn.success { background: var(--brand-2); border-color: var(--brand-2); color: #0b1118; }
    .btn.danger { background: var(--danger); border-color: var(--danger); color: white; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .list { display: flex; flex-direction: column; gap: 12px; }
    .item { padding: 12px; border: 1px solid var(--border); border-radius: 10px; background: transparent; display: grid; grid-template-columns: 1fr auto; gap: 12px; }
    .item h3 { margin: 0 0 8px 0; font-size: 16px; }
    .muted { color: var(--muted); font-size: 13px; }
    .status { font-size: 12px; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--border); }
    .status.sent { border-color: var(--brand); color: var(--brand); }
    .status.delivered { border-color: var(--brand-2); color: var(--brand-2); }
    .status.pending { }
    .settings { display: flex; gap: 8px; align-items: center; }
    .kvs { display: grid; grid-template-columns: 120px 1fr; gap: 12px; align-items: center; }
    .help { font-size: 12px; color: var(--muted); }
    footer { padding: 24px; text-align: center; color: var(--muted); }
  </style>
</head>
<body>
  <header>
    <h1>网页提醒工具</h1>
    <div class="row">
      <button id="btn-perm" class="btn">授权通知</button>
      <button id="btn-settings" class="btn">设置</button>
    </div>
  </header>

  <div class="container">
    <div id="settings-card" class="card" style="display:none;">
      <div class="kvs">
        <div>API 地址</div>
        <input id="input-api" type="text" placeholder="例如：https://your-worker.workers.dev"/>
        <div></div>
        <div class="help">此地址应指向部署的 Worker，后端路由前缀为 /api。保存后会自动重新注册 Service Worker。</div>
        <div>设备 ID</div>
        <input id="input-device" type="text" disabled/>
      </div>
      <div style="height:12px"></div>
      <div class="row">
        <button id="btn-save-settings" class="btn success">保存设置</button>
        <button id="btn-hide-settings" class="btn">关闭</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h2 style="margin-top:0;">创建提醒</h2>
        <div class="row" style="flex-direction:column; align-items:stretch;">
          <div>
            <label>标题</label>
            <input id="title" type="text" maxlength="120" placeholder="例如：喝水、开会、提交报告"/>
          </div>
          <div>
            <label>内容（可选）</label>
            <textarea id="content" maxlength="2000" placeholder="提醒的内容说明"></textarea>
          </div>
          <div>
            <label>提醒时间</label>
            <input id="dueAt" type="datetime-local"/>
          </div>
          <div class="row">
            <button id="btn-create" class="btn primary">添加提醒</button>
          </div>
          <div class="help">提示：请确保已“授权通知”，并允许浏览器显示通知。</div>
        </div>
      </div>

      <div class="card">
        <h2 style="margin-top:0;">我的提醒</h2>
        <div class="list" id="list"></div>
      </div>
    </div>
  </div>

  <footer>
    使用 Cloudflare Workers + D1 + Pages + Push API 构建
  </footer>

  <script>
    // ------------------ Config & State ------------------
    const $ = sel => document.querySelector(sel);

    const storage = {
      get apiBase() { return localStorage.getItem("API_BASE") || ""; },
      set apiBase(v) { localStorage.setItem("API_BASE", v || ""); },
      get deviceId() {
        let id = localStorage.getItem("DEVICE_ID");
        if (!id) { id = crypto.randomUUID(); localStorage.setItem("DEVICE_ID", id); }
        return id;
      },
      get vapidKey() { return localStorage.getItem("VAPID_PUBLIC_KEY") || ""; },
      set vapidKey(v) { localStorage.setItem("VAPID_PUBLIC_KEY", v || ""); },
    };

    const state = {
      loading: false,
      items: [],
      swReg: null,
    };

    // ------------------ Helpers ------------------
    function fmt(ts) {
      const d = new Date(ts);
      const pad = n => String(n).padStart(2, "0");
      const y = d.getFullYear(), m = pad(d.getMonth()+1), day = pad(d.getDate());
      const h = pad(d.getHours()), mi = pad(d.getMinutes());
      return `${y}-${m}-${day} ${h}:${mi}`;
    }
    function parseLocalDateTime(val) {
      // "YYYY-MM-DDTHH:mm"
      if (!val) return NaN;
      const [date, time] = val.split("T");
      const [y,m,d] = date.split("-").map(Number);
      const [hh,mm] = time.split(":").map(Number);
      // 按本地时区生成时间戳
      const dt = new Date(y, m-1, d, hh, mm, 0, 0);
      return dt.getTime();
    }
    function el(tag, attrs={}, ...children) {
      const e = document.createElement(tag);
      for (const [k,v] of Object.entries(attrs)) {
        if (k === "class") e.className = v;
        else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v);
      }
      for (const c of children) {
        if (c == null) continue;
        e.append(c.nodeType ? c : document.createTextNode(c));
      }
      return e;
    }
    async function api(path, opt={}) {
      const base = storage.apiBase;
      if (!base) throw new Error("请先在设置中配置 API 地址");
      const url = base.replace(/\/+$/,"") + path;
      const res = await fetch(url, {
        ...opt,
        headers: { "content-type": "application/json", ...(opt.headers || {}) },
      });
      if (!res.ok) {
        const text = await res.text().catch(()=> "");
        throw new Error(`API ${res.status}: ${text || res.statusText}`);
      }
      return res.json();
    }

    function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
      const rawData = atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    async function ensurePermission() {
      if (!("Notification" in window)) throw new Error("此浏览器不支持通知");
      if (Notification.permission === "granted") return true;
      if (Notification.permission === "denied") throw new Error("通知权限被拒绝");
      const r = await Notification.requestPermission();
      if (r !== "granted") throw new Error("用户未授权通知");
      return true;
    }

    async function registerSWAndSubscribe() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("此浏览器不支持 Push API 或 Service Worker");
      }
      const apiBase = storage.apiBase;
      if (!apiBase) throw new Error("请在设置中配置 API 地址");

      // 获取/缓存 VAPID 公钥
      let vapidKey = storage.vapidKey;
      if (!vapidKey) {
        const data = await api("/api/vapidPublicKey");
        vapidKey = data.key;
        storage.vapidKey = vapidKey;
      }

      // 以 Blob 形式注册 SW（单文件自包含）
      const swCode = `
        self.API_BASE = ${JSON.stringify(apiBase)};
        self.DEVICE_ID = ${JSON.stringify(storage.deviceId)};

        function urlBase64ToUint8Array(base64String) {
          const padding = "=".repeat((4 - base64String.length % 4) % 4);
          const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
          const rawData = atob(base64);
          const outputArray = new Uint8Array(rawData.length);
          for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
          }
          return outputArray;
        }

        async function resubscribeIfNeeded() {
          try {
            const current = await self.registration.pushManager.getSubscription();
            if (current) return current;
            // fetch vapid key
            const res = await fetch(self.API_BASE.replace(/\\/+$/,"") + "/api/vapidPublicKey");
            const data = await res.json();
            const appKey = urlBase64ToUint8Array(data.key);
            const sub = await self.registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: appKey,
            });
            await fetch(self.API_BASE.replace(/\\/+$/,"") + "/api/subscribe", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ deviceId: self.DEVICE_ID, subscription: sub.toJSON() }),
            });
            return sub;
          } catch (e) {
            console.error("resubscribe error", e);
          }
        }

        self.addEventListener("install", (e) => {
          self.skipWaiting();
        });
        self.addEventListener("activate", (e) => {
          e.waitUntil(self.clients.claim());
        });

        self.addEventListener("push", (event) => {
          event.waitUntil((async () => {
            try {
              const sub = await resubscribeIfNeeded() || await self.registration.pushManager.getSubscription();
              if (!sub) return;
              const ep = encodeURIComponent(sub.endpoint);
              const url = self.API_BASE.replace(/\\/+$/,"") + "/api/due?endpoint=" + ep;
              const res = await fetch(url);
              if (!res.ok) return;
              const data = await res.json();
              const items = data.items || [];
              for (const it of items) {
                await self.registration.showNotification(it.title || "提醒", {
                  body: it.body || "",
                  icon: undefined, // 可自定义
                  badge: undefined,
                  timestamp: it.dueAt || Date.now(),
                  data: { id: it.id },
                  requireInteraction: false,
                });
              }
            } catch (e) {
              console.error("push handler error", e);
            }
          })());
        });

        self.addEventListener("notificationclick", (event) => {
          event.notification.close();
          event.waitUntil((async () => {
            const all = await clients.matchAll({ type: "window", includeUncontrolled: true });
            if (all.length) {
              const client = all[0];
              client.focus();
              client.postMessage({ type: "focus-from-notification" });
            } else {
              clients.openWindow("/");
            }
          })());
        });

        self.addEventListener("pushsubscriptionchange", (event) => {
          event.waitUntil((async () => {
            try {
              const res = await fetch(self.API_BASE.replace(/\\/+$/,"") + "/api/vapidPublicKey");
              const data = await res.json();
              const appKey = urlBase64ToUint8Array(data.key);
              const sub = await self.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: appKey,
              });
              await fetch(self.API_BASE.replace(/\\/+$/,"") + "/api/subscribe", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ deviceId: self.DEVICE_ID, subscription: sub.toJSON() }),
              });
            } catch (e) {
              console.error("pushsubscriptionchange error", e);
            }
          })());
        });
      `;
      const blob = new Blob([swCode], { type: "application/javascript" });
      const swUrl = URL.createObjectURL(blob);
      const reg = await navigator.serviceWorker.register(swUrl, { scope: "/" });
      state.swReg = reg;

      // 订阅 push（主线程也尝试一次，便于首次注册）
      const sub = await reg.pushManager.getSubscription() || await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      await api("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ deviceId: storage.deviceId, subscription: sub.toJSON() }),
      });
    }

    // ------------------ UI Actions ------------------
    async function refreshList() {
      try {
        const data = await api(`/api/reminders?deviceId=${encodeURIComponent(storage.deviceId)}`);
        state.items = data.items || [];
        renderList();
      } catch (e) {
        console.error(e);
      }
    }

    function renderList() {
      const list = $("#list");
      list.innerHTML = "";
      if (!state.items.length) {
        list.append(el("div", { class: "muted" }, "暂无提醒"));
        return;
      }
      for (const it of state.items) {
        const status = it.deliveredAt ? "delivered" : (it.nudgeSent ? "sent" : "pending");
        const line = el("div", { class: "item" },
          el("div", {},
            el("h3", {}, it.title),
            it.body ? el("div", { class: "muted" }, it.body) : null,
            el("div", { class: "muted" }, "提醒时间：", fmt(it.dueAt))
          ),
          el("div", { style: "display:flex; gap:8px; align-items:center;" },
            el("span", { class: `status ${status}` }, status),
            el("button", {
              class: "btn danger",
              onclick: async () => {
                try {
                  await api(`/api/reminders/${it.id}?deviceId=${encodeURIComponent(storage.deviceId)}`, { method: "DELETE" });
                  await refreshList();
                } catch (e) { alert(e.message); }
              }
            }, "删除")
          )
        );
        list.append(line);
      }
    }

    async function onCreate() {
      const title = $("#title").value.trim();
      const content = $("#content").value.trim();
      const dueVal = $("#dueAt").value;
      const dueAt = parseLocalDateTime(dueVal);
      if (!title) return alert("请输入标题");
      if (!Number.isFinite(dueAt)) return alert("请选择提醒时间");
      if (dueAt < Date.now() - 60000) return alert("提醒时间不能早于当前时间");

      try {
        await api("/api/reminders", {
          method: "POST",
          body: JSON.stringify({ deviceId: storage.deviceId, title, content, dueAt }),
        });
        $("#title").value = "";
        $("#content").value = "";
        $("#dueAt").value = "";
        await refreshList();
        alert("提醒已创建");
      } catch (e) {
        alert(e.message);
      }
    }

    function showSettings(show) {
      $("#settings-card").style.display = show ? "block" : "none";
      $("#input-api").value = storage.apiBase || "";
      $("#input-device").value = storage.deviceId;
    }

    async function init() {
      $("#btn-settings").addEventListener("click", () => showSettings(true));
      $("#btn-hide-settings").addEventListener("click", () => showSettings(false));
      $("#btn-save-settings").addEventListener("click", async () => {
        const v = $("#input-api").value.trim();
        storage.apiBase = v;
        // 重新注册 SW 以更新 API_BASE
        if (state.swReg) {
          try { await state.swReg.unregister(); } catch {}
          state.swReg = null;
        }
        if (v) {
          try {
            await ensurePermission();
            await registerSWAndSubscribe();
            alert("已保存并注册 Service Worker");
            await refreshList();
          } catch (e) {
            alert(e.message);
          }
        } else {
          alert("已保存空 API 地址，请重新填写以启用");
        }
      });

      $("#btn-perm").addEventListener("click", async () => {
        try {
          await ensurePermission();
          await registerSWAndSubscribe();
          alert("已授权并完成订阅");
        } catch (e) {
          alert(e.message);
        }
      });

      $("#btn-create").addEventListener("click", onCreate);

      // 自动初始化：如果已配置 API，尝试注册 SW 并刷新
      if (storage.apiBase) {
        try {
          await ensurePermission();
          await registerSWAndSubscribe();
        } catch (e) {
          console.warn(e);
        }
        await refreshList();
      }
    }

    init();
    navigator.serviceWorker?.addEventListener("message", (e) => {
      if (e.data?.type === "focus-from-notification") {
        // 可在此刷新列表
        refreshList();
      }
    });
  </script>
</body>
</html>
```

5) 部署与使用步骤

A) 生成 VAPID 密钥对
- 方法一（Node 环境）：
  1) 新建 generate-vapid.mjs（使用 WebCrypto，Node 18+）：
     import { generateKeyPair } from 'crypto';
     import { createPublicKey } from 'crypto';
     import { Buffer } from 'buffer';
     const kp = await new Promise((res, rej) => {
       generateKeyPair('ec', { namedCurve: 'P-256' }, (e, pub, priv) => e ? rej(e) : res({ pub, priv }));
     });
     const jwk = kp.priv.export({ format: 'jwk' });
     // 导出 uncompressed public key (04 | X | Y)
     const pubDer = kp.pub.export({ type: 'spki', format: 'der' });
     // 解析出 x,y 更繁琐，建议直接用 web-push 库生成，或使用浏览器生成（见方法二）
     console.log('Private JWK:', JSON.stringify(jwk));
  2) 更简单：使用 web-push 库快速生成（一次性执行）：
     npm i -g web-push
     web-push generate-vapid-keys
     输出会有 Public Key（base64url）与 Private Key（base64url d）。若要得到完整 JWK，可使用网页生成（方法二）或将 d/x/y 组合为 JWK。
- 方法二（浏览器控制台）：
  在任意 HTTPS 页打开 DevTools Console，运行：
  (async () => {
    const key = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign','verify']);
    const jwkPriv = await crypto.subtle.exportKey('jwk', key.privateKey);
    const jwkPub = await crypto.subtle.exportKey('jwk', key.publicKey);
    const x = atob(jwkPub.x.replace(/-/g,'+').replace(/_/g,'/'));
    const y = atob(jwkPub.y.replace(/-/g,'+').replace(/_/g,'/'));
    const u8 = new Uint8Array(65); u8[0]=0x04;
    for (let i=0;i<32;i++) { u8[1+i]=x.charCodeAt(i); u8[33+i]=y.charCodeAt(i); }
    const b64u = btoa(String.fromCharCode(...u8)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    console.log("VAPID_PUBLIC_KEY (uncompressed 65 bytes, base64url):", b64u);
    console.log("VAPID_PRIVATE_JWK:", JSON.stringify(jwkPriv));
  })();

收集到两个值：
- VAPID_PUBLIC_KEY（base64url，长度应为 86 字符左右）
- VAPID_PRIVATE_JWK（JSON）

B) 创建与初始化 D1
- wrangler d1 create reminders-db
- 将输出的 database_id 写入 wrangler.toml 的 database_id
- 初始化表结构：
  wrangler d1 execute reminders-db --file=./schema.sql

C) 配置 wrangler.toml 并设置 secret
- 编辑 wrangler.toml：填入 VAPID_PUBLIC_KEY 与 VAPID_SUBJECT
- 设置私钥：
  wrangler secret put VAPID_PRIVATE_JWK
  粘贴步骤 A 得到的 JWK JSON

D) 发布 Worker
- wrangler publish
- 记录发布后的 Workers 域名，例如：https://reminder-worker.yourname.workers.dev

E) 部署前端 Pages
- 新建 Cloudflare Pages 项目，选择“直接上传”或从仓库构建
- 上传上面的 index.html（单文件即可）
- 部署完成后，打开页面，点击右上角“设置”，将 API 地址填为你的 Worker 地址（例如 https://reminder-worker.yourname.workers.dev），保存
- 点击“授权通知”，在浏览器授权
- 创建提醒，等待到点即可收到推送通知

可选优化
- 同域部署：可用 Cloudflare Routes 将 /api/* 路由到 Worker，这样 Pages 的前端就可以用相同 origin，无需在页面里配置 API 地址（把 API_BASE 默认设为 location.origin 即可）。
- 去重策略：当前 Cron 推送后将 nudge_sent=1，SW 拉取后置 delivered_at，已避免重复推送；如需失败重试，可加失败标记与重试间隔。
- 定时粒度：Cron 每分钟执行。若需更细粒度可结合 Queues 或在前端加前台定时轮询兜底。
- 权限提示：可在未授权时显示醒目提示。

到此，一个完整可用、Cloudflare 原生部署的网页提醒工具就实现了。需要我打包成 Git 仓库结构或帮你把 Pages 和 Worker 同域集成路由配置示例也可以继续补上。