const CACHE_NAME = 'unicart-v1';
const urlsToCache = [
  '/',
  '/unicart-logo.png',
  '/hero-image.jpg',
  '/manifest.json'
];

// Install: Cache static assets.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch: Cache-first for static; network-only for /api (no cache for auth/mutations).
self.addEventListener('fetch', event => {
  // Network-only for API routes: Always fresh fetch, reject offline.
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Offline: Return empty response; app handles Axios error.
        return new Response(JSON.stringify({ error: 'Offline - Check connection' }), {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    );
    return;
  }
  // Static: Cache-first fallback.
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});