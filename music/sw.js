const CACHE_VERSION = 'geek-music-v4';
const STATIC_CACHE_NAME = CACHE_VERSION + '-static';
const IMAGES_CACHE_NAME = CACHE_VERSION + '-images';
const API_CACHE_NAME = CACHE_VERSION + '-api';
const DYNAMIC_CACHE_NAME = CACHE_VERSION + '-dynamic';

const urlsToCache = [
    './index.html',
    './manifest.json',
    './YouTubePlayerManager.js'
];

// 安装时缓存核心文件
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// 激活时清理旧缓存
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE_NAME &&
                        cacheName !== IMAGES_CACHE_NAME &&
                        cacheName !== API_CACHE_NAME &&
                        cacheName !== DYNAMIC_CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 根据请求类型使用不同的缓存策略
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // 【新增修复代码】忽略非 http/https 协议的请求（如 chrome-extension://）
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // 【新增修复代码】忽略 POST 请求（Cache API 只能缓存 GET）
    if (request.method !== 'GET') {
        return;
    }

    // 静态资源（HTML, CSS, JS, manifest）- 网络优先，失败时使用缓存
    if (isStaticResource(request)) {
        event.respondWith(networkFirstStrategy(request));
    }
    // 图片资源 - 缓存优先，网络更新
    else if (isImageRequest(request)) {
        event.respondWith(cacheFirstStrategy(request, IMAGES_CACHE_NAME));
    }
    // API 请求 - 网络优先，带缓存更新，设置过期时间
    else if (isApiRequest(request)) {
        event.respondWith(networkFirstWithExpiryStrategy(request));
    }
    // 其他动态资源 - 动态缓存策略
    else {
        event.respondWith(networkFirstStrategy(request));
    }
});

// 判断是否为静态资源
function isStaticResource(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    return pathname.endsWith('.html') ||
           pathname.endsWith('.css') ||
           pathname.endsWith('.js') ||
           pathname.endsWith('manifest.json');
}

// 判断是否为图片请求
function isImageRequest(request) {
    return request.destination === 'image' ||
           request.url.includes('artworkUrl') ||
           request.url.includes('cover') ||
           /\.(png|jpe?g|gif|svg|webp)$/i.test(request.url);
}

// 判断是否为API请求
function isApiRequest(request) {
    return request.url.includes('itunes.apple.com') ||
           request.url.includes('api.lyrics.ovh') ||
           request.url.includes('wikipedia.org/api') ||
           request.url.includes('randomuser.me') ||
           request.url.includes('api.kanye.rest') ||
           request.url.includes('v1.hitokoto.cn') ||
           request.url.includes('open-meteo.com') ||
           request.url.includes('get.geojs.io');
}

// 网络优先策略
function networkFirstStrategy(request) {
    // Skip caching requests from browser extensions
    if (request.url.startsWith('chrome-extension:') ||
        request.url.startsWith('moz-extension:') ||
        request.url.startsWith('safari-extension:')) {
        return fetch(request);
    }

    return fetch(request)
        .then(response => {
            if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE_NAME)
                    .then(cache => cache.put(request, responseClone));
            }
            return response;
        })
        .catch(() => caches.match(request));
}

// 缓存优先策略（用于图片）
function cacheFirstStrategy(request, cacheName) {
    // Skip caching requests from browser extensions
    if (request.url.startsWith('chrome-extension:') ||
        request.url.startsWith('moz-extension:') ||
        request.url.startsWith('safari-extension:')) {
        return fetch(request);
    }

    return caches.match(request)
        .then(response => {
            if (response) {
                // 如果缓存中有，则使用缓存，并在后台更新
                fetch(request)
                    .then(networkResponse => {
                        if (networkResponse.status === 200) {
                            const networkResponseClone = networkResponse.clone();
                            caches.open(cacheName)
                                .then(cache => cache.put(request, networkResponseClone));
                        }
                    })
                    .catch(() => {}); // 忽略更新失败
                return response;
            }

            // 缓存中没有，则从网络获取并存储 
            return fetch(request)
                .then(networkResponse => {
                    if (networkResponse.status === 200) {
                        const networkResponseClone = networkResponse.clone();
                        caches.open(cacheName)
                            .then(cache => cache.put(request, networkResponseClone));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match(request)); // 如果网络也失败，返回缓存
        });
}

// 带过期时间的网络优先策略（用于API）
function networkFirstWithExpiryStrategy(request) {
    // Skip caching requests from browser extensions
    if (request.url.startsWith('chrome-extension:') ||
        request.url.startsWith('moz-extension:') ||
        request.url.startsWith('safari-extension:')) {
        return fetch(request);
    }

    const cacheKey = request.url;

    return caches.open(API_CACHE_NAME)
        .then(cache => cache.match(request))
        .then(cachedResponse => {
            if (!cachedResponse) {
                // 没有缓存，直接从网络获取
                return fetchAndCache(request);
            }

            // 检查缓存是否过期（1小时）
            const expirationTime = 60 * 60 * 1000; // 1小时
            const cachedTime = cachedResponse.headers.get('x-cache-time');

            if (!cachedTime || (Date.now() - parseInt(cachedTime)) > expirationTime) {
                // 缓存过期，从网络获取并更新缓存
                return fetchAndCache(request);
            }

            // 缓存未过期，返回缓存，并在后台更新
            fetch(request)
                .then(networkResponse => {
                    if (networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        const headers = new Headers(responseToCache.headers);
                        headers.set('x-cache-time', Date.now().toString());

                        const responseWithTime = new Response(responseToCache.body, {
                            status: responseToCache.status,
                            statusText: responseToCache.statusText,
                            headers: headers
                        });

                        caches.open(API_CACHE_NAME)
                            .then(cache => cache.put(request, responseWithTime));
                    }
                })
                .catch(() => {}); // 忽略更新失败

            return cachedResponse;
        });
}

// 从网络获取并缓存的辅助函数
function fetchAndCache(request) {
    // Skip caching requests from browser extensions
    if (request.url.startsWith('chrome-extension:') ||
        request.url.startsWith('moz-extension:') ||
        request.url.startsWith('safari-extension:')) {
        return fetch(request);
    }

    return fetch(request)
        .then(networkResponse => {
            if (networkResponse.status === 200) {
                const responseToCache = networkResponse.clone();
                const headers = new Headers(responseToCache.headers);
                headers.set('x-cache-time', Date.now().toString());

                const responseWithTime = new Response(responseToCache.body, {
                    status: networkResponse.status,
                    statusText: responseToCache.statusText,
                    headers: headers
                });

                caches.open(API_CACHE_NAME)
                    .then(cache => cache.put(request, responseWithTime));
            }
            return networkResponse;
        })
        .catch(() => {
            // 网络失败时返回缓存
            return caches.open(API_CACHE_NAME)
                .then(cache => cache.match(request));
        });
}