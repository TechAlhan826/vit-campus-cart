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
  // DO NOT intercept API routes - let Vite proxy handle them
  if (event.request.url.includes('/api/')) {
    return; // Don't handle, let browser fetch normally
  }
  
  // Static: Cache-first fallback.
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});