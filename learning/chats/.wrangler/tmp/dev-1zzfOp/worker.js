var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-iYgB7i/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/chatroom_do.js
var MSG_TYPE_CHAT = "chat";
var MSG_TYPE_DELETE = "delete";
var MSG_TYPE_SYSTEM_STATE = "system_state";
var MSG_TYPE_HISTORY = "history";
var ChatRoomDurableObject = class {
  static {
    __name(this, "ChatRoomDurableObject");
  }
  constructor(state, env) {
    this.state = state;
    this.users = /* @__PURE__ */ new Map();
    this.messages = [];
    this.lastSave = 0;
    this.initializePromise = this.loadHistory();
  }
  // 从持久化存储中加载历史消息
  async loadHistory() {
    await this.state.storage.transaction(async (txn) => {
      const storedMessages = await txn.get("messages");
      if (storedMessages) {
        this.messages = storedMessages;
      }
    });
  }
  // 安排一次节流的保存操作
  scheduleSave() {
    const now = Date.now();
    if (now - this.lastSave > 5e3) {
      this.lastSave = now;
      this.state.waitUntil(this.saveHistory());
    }
  }
  // 将聊天记录完整地保存到持久化存储中
  async saveHistory() {
    try {
      await this.state.storage.transaction(async (txn) => {
        await txn.put("messages", this.messages);
        console.log("Chat history saved to storage.");
      });
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  }
  // Durable Object 的主入口点
  async fetch(request) {
    await this.initializePromise;
    return this.state.blockConcurrencyWhile(async () => {
      const upgradeHeader = request.headers.get("Upgrade");
      if (upgradeHeader !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
      }
      const url = new URL(request.url);
      const username = url.searchParams.get("username") || "Anonymous";
      const { 0: client, 1: server } = new WebSocketPair();
      await this.handleSession(server, username);
      return new Response(null, {
        status: 101,
        webSocket: client
      });
    });
  }
  // 处理一个新的 WebSocket 连接会话
  async handleSession(ws, username) {
    ws.accept();
    const user = { ws, username };
    this.users.set(ws, user);
    this.sendMessage(ws, {
      type: MSG_TYPE_HISTORY,
      payload: this.messages
    });
    this.broadcastSystemState();
    ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === MSG_TYPE_CHAT) {
          this.handleChatMessage(user, data.payload);
        } else if (data.type === MSG_TYPE_DELETE) {
          this.handleDeleteMessage(data.payload);
        }
      } catch (err) {
        console.error("Failed to handle message:", err);
      }
    });
    ws.addEventListener("close", () => this.handleClose(ws));
    ws.addEventListener("error", () => this.handleClose(ws));
  }
  // 处理从客户端收到的聊天消息
  handleChatMessage(user, payload) {
    const message = {
      id: crypto.randomUUID(),
      username: user.username,
      text: payload.text,
      timestamp: Date.now()
    };
    this.messages.push(message);
    if (this.messages.length > 100) {
      this.messages.shift();
    }
    this.broadcast({
      type: MSG_TYPE_CHAT,
      payload: message
    });
    this.scheduleSave();
  }
  // 处理从客户端收到的删除消息
  handleDeleteMessage(payload) {
    this.messages = this.messages.filter((m) => m.id !== payload.id);
    this.broadcast({
      type: MSG_TYPE_DELETE,
      payload
    });
    this.scheduleSave();
  }
  // 处理 WebSocket 连接关闭
  handleClose(ws) {
    if (this.users.has(ws)) {
      this.users.delete(ws);
      this.broadcastSystemState();
    }
  }
  // --- 消息发送辅助方法 ---
  // 发送单个消息的底层方法
  sendMessage(ws, message) {
    try {
      ws.send(JSON.stringify(message));
    } catch (err) {
      console.error("Failed to send message:", err);
      this.handleClose(ws);
    }
  }
  // 广播消息给所有连接的客户端
  broadcast(message) {
    this.users.forEach((user) => {
      this.sendMessage(user.ws, message);
    });
  }
  // 广播最新的系统状态（如用户列表）
  broadcastSystemState() {
    const userList = Array.from(this.users.values()).map((u) => u.username);
    this.broadcast({
      type: MSG_TYPE_SYSTEM_STATE,
      payload: {
        users: userList
      }
    });
  }
};

// src/worker.js
import html from "./2ae00f5d1f1a4437333948c26bc0d2f5a829cf2e-index.html";
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/").filter((part) => part);
    if (url.pathname === "/upload" && request.method === "POST") {
      try {
        const filename = request.headers.get("X-Filename") || `upload-${Date.now()}`;
        const object = await env.R2_BUCKET.put(filename, request.body, {
          httpMetadata: request.headers
        });
        const publicUrl = `${new URL(request.url).origin}/${object.key}`;
        return new Response(JSON.stringify({ url: publicUrl }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("Upload error:", error);
        return new Response("Error uploading file.", { status: 500 });
      }
    }
    if (pathParts.length === 0) {
      return new Response("Welcome! Please access /<room-name> to join a chat room.", { status: 404 });
    }
    const roomName = pathParts[0];
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader === "websocket") {
      console.log(`Routing WebSocket for room [${roomName}] to Durable Object...`);
      const doId = env.CHAT_ROOM_DO.idFromName(roomName);
      const stub = env.CHAT_ROOM_DO.get(doId);
      return stub.fetch(request);
    }
    return new Response(html, {
      headers: { "Content-Type": "text/html;charset=UTF-8" }
    });
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-iYgB7i/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-iYgB7i/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  ChatRoomDurableObject,
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
