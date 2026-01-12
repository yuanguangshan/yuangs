const CACHE_NAME = 'ai-monitor-v1.0.1';
const urlsToCache = [
  '/pages/ai.html',
  '/poe/public/index.html',
  '/manifest.json',
  '/favicon.ico',
  'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js',
  'https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 安装 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
  // 检查请求是否来自 chrome-extension 方案
  if (event.request.url.startsWith('chrome-extension://')) {
    // 对于 chrome-extension 请求，直接跳过缓存处理
    event.respondWith(fetch(event.request));
    return;
  }

  // 检查请求是否是跨域资源（如CDN资源），这些资源可能无法缓存
  if (event.request.mode === 'no-cors') {
    // 对于 no-cors 请求，直接返回网络请求结果，不进行缓存
    event.respondWith(
      fetch(event.request)
    );
    return;
  }

  if (event.request.url.includes('/api/stats')) {
    // 对于 API 请求，提供一个模拟的离线响应
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request).catch(() => {
            // 返回一个模拟的离线数据响应
            return new Response(JSON.stringify({
              summary: [],
              latest: [],
              heatmap: [],
              models: [],
              performance: []
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
  } else {
    // 对于其他请求，使用标准缓存优先策略
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // 如果在缓存中找到请求，则返回缓存的响应
          if (response) {
            return response;
          }

          // 否则发起实际网络请求
          return fetch(event.request).then(response => {
            // 检查收到的响应是否有效
            // 修改这里：允许 basic 和 cors 类型的响应（支持 CDN 资源）
            if(!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
              return response;
            }

            // 对于有效的响应，将其复制并缓存
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }).catch(error => {
            // 如果网络请求失败，尝试从缓存中获取
            console.error('Fetch failed:', error);
            return caches.match(event.request);
          });
        })
    );
  }
});

// 更新缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});