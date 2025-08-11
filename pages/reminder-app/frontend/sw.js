// sw.js - 独立的 Service Worker 文件
var API_BASE = ""; // 将在运行时设置
var DEVICE_ID = ""; // 将在运行时设置

function urlBase64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  var rawData = atob(base64);
  var outputArray = new Uint8Array(rawData.length);
  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// 监听来自主线程的消息，更新配置
self.addEventListener("message", function(event) {
  if (event.data && event.data.type === "UPDATE_CONFIG") {
    API_BASE = event.data.apiBase;
    DEVICE_ID = event.data.deviceId;
  }
});

// 安装事件 - 缓存重要资源
self.addEventListener("install", function(e) {
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener("activate", function(e) {
  e.waitUntil(self.clients.claim());
});

// 推送事件处理
self.addEventListener("push", function(event) {
  event.waitUntil(handlePushEvent(event));
});

async function handlePushEvent(event) {
  try {
    var sub = await self.registration.pushManager.getSubscription();
    if (!sub) return;
    
    // 确保 API_BASE 已设置
    if (!API_BASE) {
      console.error("API_BASE not set in Service Worker");
      return;
    }
    
    var ep = encodeURIComponent(sub.endpoint);
    var url = API_BASE.replace(/\/+$/, "") + "/api/due?endpoint=" + ep;
    var res = await fetch(url);
    if (!res.ok) return;
    
    var data = await res.json();
    var items = data.items || [];
    
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      await self.registration.showNotification(it.title || "提醒", {
        body: it.body || "",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        timestamp: it.dueAt || Date.now(),
        data: { id: it.id },
        requireInteraction: true,
        tag: "reminder-" + it.id
      });
    }
  } catch (e) {
    console.error("push handler error", e);
    // 显示通用通知
    await self.registration.showNotification("提醒工具", {
      body: "您有一个新的提醒",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      timestamp: Date.now(),
      requireInteraction: true
    });
  }
}

// 通知点击事件处理
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(handleNotificationClick(event));
});

async function handleNotificationClick(event) {
  var all = await clients.matchAll({ type: "window", includeUncontrolled: true });
  if (all.length) {
    var client = all[0];
    client.focus();
  } else {
    clients.openWindow("/");
  }
}

// 订阅变更事件处理
self.addEventListener("pushsubscriptionchange", function(event) {
  event.waitUntil(handlePushSubscriptionChange(event));
});

async function handlePushSubscriptionChange(event) {
  try {
    // 重新订阅
    var res = await fetch(API_BASE.replace(/\/+$/, "") + "/api/vapidPublicKey");
    var data = await res.json();
    var appKey = urlBase64ToUint8Array(data.key);
    var sub = await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: appKey,
    });
    
    // 发送新的订阅信息到服务器
    await fetch(API_BASE.replace(/\/+$/, "") + "/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ deviceId: DEVICE_ID, subscription: sub.toJSON() }),
    });
  } catch (e) {
    console.error("pushsubscriptionchange error", e);
  }
}