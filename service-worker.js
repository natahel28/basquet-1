const CACHE_NAME = 'basquet-pagos-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.svg',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest'
];

// Instalar Service Worker y guardar recursos en caché
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activar y limpiar cachés viejas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar peticiones y servir desde caché
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Si está en caché, devolverlo
            if (response) {
                return response;
            }
            // Si no, buscar en la red
            return fetch(event.request).catch(() => {
                // Fallback offline
            });
        })
    );
});
