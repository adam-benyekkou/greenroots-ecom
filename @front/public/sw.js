const CACHE_VERSION = 'v1.0.0';
const API_CACHE_NAME = `greenroots-api-${CACHE_VERSION}`;

console.log('Service Worker: Script loaded');

// Installation
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing');
    self.skipWaiting();
});

// Activation
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName.startsWith('greenroots-') && cacheName !== API_CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activated');
            return self.clients.claim();
        })
    );
});

// Cache configuration
const CACHE_CONFIG = {
    '/api/trees/homepage': 5 * 60 * 1000, // 5 minutes
    '/api/trees/continent/': 10 * 60 * 1000, // 10 minutes
    '/api/trees?': 3 * 60 * 1000, // 3 minutes
    '/api/trees/': 15 * 60 * 1000, // 15 minutes
};

// Check if response is expired
function isExpired(response, ttl) {
    if (!response) return true;

    const cachedDate = response.headers.get('sw-cached-date');
    if (!cachedDate) return true;

    const age = Date.now() - new Date(cachedDate).getTime();
    return age > ttl;
}

// Add timestamp to response
function addTimestamp(response) {
    const newResponse = response.clone();
    newResponse.headers.set('sw-cached-date', new Date().toISOString());
    return newResponse;
}

// Get cache TTL for URL
function getCacheTTL(url) {
    for (const [pattern, ttl] of Object.entries(CACHE_CONFIG)) {
        if (url.includes(pattern)) {
            return ttl;
        }
    }
    return null;
}

// Fetch handler
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Only handle GET requests to API endpoints
    if (request.method !== 'GET' || !url.pathname.startsWith('/api/')) {
        return;
    }

    const ttl = getCacheTTL(url.pathname + url.search);
    if (!ttl) return;

    console.log('Service Worker: Intercepting', request.url);

    event.respondWith(
        caches.open(API_CACHE_NAME).then(cache => {
            return cache.match(request).then(cachedResponse => {
                // If we have a cached response and it's not expired, use it
                if (cachedResponse && !isExpired(cachedResponse, ttl)) {
                    console.log('Service Worker: Cache hit for', request.url);
                    return cachedResponse;
                }

                // Otherwise, fetch from network
                return fetch(request).then(networkResponse => {
                    if (networkResponse.ok) {
                        console.log('Service Worker: Caching response for', request.url);
                        const responseToCache = addTimestamp(networkResponse);
                        cache.put(request, responseToCache.clone());
                    }
                    return networkResponse;
                }).catch(error => {
                    console.error('Service Worker: Network error for', request.url, error);
                    // If network fails and we have stale cache, use it
                    if (cachedResponse) {
                        console.log('Service Worker: Using stale cache for', request.url);
                        return cachedResponse;
                    }
                    throw error;
                });
            });
        })
    );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
    console.log('Service Worker: Received message', event.data);

    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'CLEAR_API_CACHE':
                caches.delete(API_CACHE_NAME).then(() => {
                    console.log('Service Worker: API cache cleared');
                    event.ports[0].postMessage({ success: true });
                });
                break;

            case 'CLEAR_CACHE_FOR_URL':
                caches.open(API_CACHE_NAME).then(cache => {
                    cache.delete(event.data.url).then(() => {
                        console.log('Service Worker: Cache cleared for', event.data.url);
                        event.ports[0].postMessage({ success: true });
                    });
                });
                break;

            case 'GET_CACHE_STATUS':
                getCacheStatus().then(status => {
                    event.ports[0].postMessage(status);
                });
                break;
        }
    }
});

// Get cache status
async function getCacheStatus() {
    try {
        const cache = await caches.open(API_CACHE_NAME);
        const keys = await cache.keys();

        const status = {
            totalEntries: keys.length,
            entries: []
        };

        for (const request of keys.slice(0, 10)) {
            const response = await cache.match(request);
            const cachedDate = response ? response.headers.get('sw-cached-date') : null;

            status.entries.push({
                url: request.url,
                cachedDate,
                age: cachedDate ? Date.now() - new Date(cachedDate).getTime() : null
            });
        }

        return status;
    } catch (error) {
        console.error('Service Worker: Error getting cache status', error);
        return { error: error.message };
    }
}