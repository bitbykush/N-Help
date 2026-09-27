const CACHE_NAME = 'n-help-cache-v1';
const MAP_CACHE_NAME = 'n-help-map-tiles-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon.svg',
  './offline-fallback.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static offline assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== MAP_CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // 1. Navigation requests: Stale-while-revalidate with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('./index.html').then((response) => {
          return response || caches.match('./offline-fallback.html');
        });
      })
    );
    return;
  }

  // 2. Map Tile requests: Cache-first from MAP_CACHE_NAME with network fallback
  const isMapTile = url.includes('basemaps.cartocdn.com') || 
                    url.includes('tile.openstreetmap.org') || 
                    url.includes('mapbox.com') ||
                    url.includes('stadiamaps.com') ||
                    url.includes('.png') && (url.includes('/tile') || url.includes('/dark_all/'));

  if (isMapTile) {
    event.respondWith(
      caches.open(MAP_CACHE_NAME).then((mapCache) => {
        return mapCache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              mapCache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return cached fallback or null if completely offline
            return cachedResponse || new Response('', { status: 404, statusText: 'Tile Offline' });
          });
        });
      })
    );
    return;
  }

  // 3. General assets: Cache-first with network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.destination === 'image') {
          return caches.match('./icons/icon.svg');
        }
      });
    })
  );
});
