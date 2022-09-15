/* eslint no-restricted-globals: 0*/
// Establish a cache name
const cacheName = 'PortCMS-cache-v1';

self.addEventListener('install', function() {
    self.skipWaiting();
});
self.addEventListener('activate', function() {
    console.log('Service worker background jobs activated');
});

async function fetchAndCache(event) {
    try {
        const response = await fetch(event.request);
        const responseClone = response.clone();
        const cache = await caches.open(cacheName);
        await cache.put(event.request, responseClone);
        return response;
    } catch (e) {
        return e;
    }
}

async function fetchWithCache(event) {
    const cache = await caches.open(cacheName);
    const response = await cache.match(event.request);
    if (!!response) {
        fetchAndCache(event).then((value) => {
            console.log(`Background cache update job finished for ${value.url}, job-status: ${value.status}`);
        });
        return response;
    } else {
        return fetchAndCache(event);
    }
}

async function networkFirst(event){
        const cache = await caches.open(cacheName);
        return fetch(event.request.url,{
            headers: event.request.headers,
        }).then((fetchedResponse) => {
            cache.put(event.request, fetchedResponse.clone());
            return fetchedResponse;
        }).catch(() => {
            return cache.match(event.request.url);
        });
}

function handleFetch(event) {
    if (event.request.method === 'GET') {
        if (event.request.headers.get("cache-control") !== "no-cache") {
            event.respondWith(fetchWithCache(event));
        }
        else{
            event.respondWith(networkFirst(event));
        }
    }
}

self.addEventListener("fetch", handleFetch);