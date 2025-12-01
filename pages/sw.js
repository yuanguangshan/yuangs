const CACHE_NAME = 'geek-music-v2';
const urlsToCache = [
    './applemusic.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Claim all clients to take control immediately
self.addEventListener('activate', event => {
    event.waitUntil(
        self.clients.claim()
    );
});