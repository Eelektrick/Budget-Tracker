const CACHE_NAME = "static-cache-bt2";
const DATA_CACHE_NAME = "data-cache-bt1";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/db.js",
    "/styles.css",
    "/index.js",
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

//Install the cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("installing cache")
            return cache.addAll(FILES_TO_CACHE)
        })
    );
  self.skipWaiting();
});

