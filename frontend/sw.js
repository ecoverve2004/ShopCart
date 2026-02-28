// SERVICE WORKER - sw.js
// Handles caching, offline support, and background sync

const CACHE_NAME = 'shopeasy-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/main.js',
    '/js/products.js',
    '/js/cart.js',
    '/js/auth.js',
    '/js/performance.js'
];

// INSTALL EVENT
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// ACTIVATE EVENT
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
    self.clients.claim();
});

// FETCH EVENT - Network first, fallback to cache
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // API requests - Network first
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Static assets - Cache first
    event.respondWith(
        caches.match(request).then(response => {
            return response || fetch(request).then(response => {
                const clonedResponse = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, clonedResponse);
                });
                return response;
            });
        }).catch(() => {
            // Offline fallback
            return new Response('Offline - Please check your connection', {
                status: 503,
                statusText: 'Service Unavailable'
            });
        })
    );
});

// BACKGROUND SYNC
self.addEventListener('sync', event => {
    if (event.tag === 'sync-orders') {
        event.waitUntil(syncOrders());
    }
});

async function syncOrders() {
    try {
        const db = await openDB();
        const orders = await db.getAll('pending-orders');
        
        for (const order of orders) {
            await fetch('/api/orders', {
                method: 'POST',
                body: JSON.stringify(order)
            });
            await db.delete('pending-orders', order.id);
        }
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

// PUSH NOTIFICATIONS
self.addEventListener('push', event => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icon.png',
        badge: '/badge.png'
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// MESSAGE HANDLING
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
