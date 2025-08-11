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

self.addEventListener("install", function(e) {
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(self.clients.claim());
});

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
        icon: undefined,
        badge: undefined,
        timestamp: it.dueAt || Date.now(),
        data: { id: it.id },
        requireInteraction: false,
      });
    }
  } catch (e) {
    console.error("push handler error", e);
  }
}

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(handleNotificationClick(event));
});

async function handleNotificationClick(event) {
  var all = await clients.matchAll({ type: "window", includeUncontrolled: true });
  if (all.length) {
    var client = all[0];
    client.focus();
    // 注意：这里可能无法直接通信，因为变量作用域问题
  } else {
    clients.openWindow("/");
  }
}