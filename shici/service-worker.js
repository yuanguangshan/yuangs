// Service Worker for PWA functionality

const CACHE_NAME = 'shici-v1.0.0';
const DATA_CACHE_NAME = 'shici-data-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/base.css',
  '/assets/css/components.css',
  '/assets/css/responsive.css',
  '/assets/js/config.js',
  '/assets/js/data-loader.js',
  '/assets/js/ui.js',
  '/assets/js/poem-display.js',
  '/assets/js/author-data.js',
  '/manifest.json'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  console.log('Service Worker installing.');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache:', error);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  // Skip non-GET requests and API calls to external services
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Skip requests to external domains (like fonts.googleapis.com)
  if (url.origin !== self.location.origin && !url.pathname.includes('/api/')) {
    // For external resources that are not critical, try to fetch but don't cache
    event.respondWith(
      fetch(event.request).catch(() => {
        // If external request fails, return a placeholder or cache fallback
        return new Response('', { status: 200, statusText: 'External resource not available offline' });
      })
    );
    return;
  }

  // For API or data requests, try cache first then network
  if (url.pathname.includes('/api/') || url.pathname.includes('data/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached version if available
          if (response) {
            console.log('Data served from cache:', event.request.url);
            return response;
          }

          // Otherwise make network request
          return fetch(event.request).then(networkResponse => {
            // If response is valid, clone it and store in data cache
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();

              caches.open(DATA_CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }

            return networkResponse;
          }).catch(() => {
            // If network fails, return a meaningful response
            return new Response(JSON.stringify({ error: 'Offline: Using cached data' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
  } else {
    // For regular assets, use standard cache-then-network strategy
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached version if available
          if (response) {
            return response;
          }

          // Otherwise make network request
          return fetch(event.request).then(response => {
            // If response is valid, clone it and store in cache
            if (response && response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          });
        })
        .catch(() => {
          // If both cache and network fail, return fallback response for essential files
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }

          // Return error for other resources
          return new Response('', {
            status: 404,
            statusText: 'Not Found'
          });
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating.');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Listen for message from the main app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Handle data sync messages
  if (event.data && event.data.type === 'CLEAR_DATA_CACHE') {
    caches.delete(DATA_CACHE_NAME);
  }
});