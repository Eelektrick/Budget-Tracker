const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/db.js",
    "/styles.css",
    "/index.js",
    "/manifest.webmanifest",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

const CACHE_NAME = "static-cache-bt2";
const DATA_CACHE_NAME = "data-cache-bt1";

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

// activate
self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
    );
    self.clients.claim();
});

//Fetch 
self.addEventListener("fetch", function(event) {
    // cache successful requests to the API
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                .then(response => {
                // If the response was good, clone it and store it in the cache.
                if (response.status === 200) {
                    cache.put(event.request.url, response.clone());
                }   
                return response;
                })
                .catch(error => {
                    // Network request failed, try to get it from the cache.
                    return cache.match(event.request);
                });
            })
            .catch(error => console.log(error))
        );  
      return;
    }
  
    // if the request is not for the API, serve static assets using "offline-first" approach.
    event.respondWith(
        fetch(event.request).catch(function(){
            return caches.match(event.request).then(function(response) {
                if (response){return response}
                else if (event.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/")
                }
            })

        })
    );
});