const CACHE_NAME = 'poe-chat-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/maskable_icon_x512.png'
];

// 1. Install - 预缓存关键资源
self.addEventListener('install', (event) => {
  // 让新的 SW 立即进入 activate 状态，不用等待旧的 SW 关闭
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. Fetch - 网络优先 (Network First)
self.addEventListener('fetch', (event) => {
  // 【关键修复】只缓存 GET 请求，跳过 POST 等其他请求
  if (event.request.method !== 'GET') {
    return;
  }

  // 【新增修复】检查请求 URL 协议，跳过不支持的协议
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) {
    // 跳过非 HTTP/HTTPS 协议的请求（如 chrome-extension://, moz-extension:// 等）
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 检查响应是否有效
        // 注意：如果你需要缓存 CDN 资源，请删除 response.type !== 'basic' 的检查
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // 克隆响应流
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // 检查请求 URL 协议，确保可以缓存
          try {
            cache.put(event.request, responseToCache);
          } catch (error) {
            console.warn('Failed to cache request:', event.request.url, error);
          }
        });

        return response; // 总是返回网络数据
      })
      .catch(() => {
        // 网络请求失败（断网），尝试从缓存读取
        return caches.match(event.request);
      })
  );
});

// 3. Activate - 清理旧缓存
self.addEventListener('activate', (event) => {
  // 立即接管所有页面，不用等用户刷新
  event.waitUntil(clients.claim());

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});