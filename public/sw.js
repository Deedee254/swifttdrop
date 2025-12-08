// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = "swiftdrop-offline-v1";

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll([
        '/',
        '/offline',
        '/manifest.json'
      ]);
    })
  );
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // If request was successful, add result to cache
        event.waitUntil(updateCache(event.request, response.clone()));
        return response;
      })
      .catch(function(error) {
        // If network request failed, try to get it from cache
        return fromCache(event.request);
      })
  );
});

function fromCache(request) {
  // Check to see if you have it in the cache
  return caches.open(CACHE).then(function(cache) {
    return cache.match(request).then(function(matching) {
      if (!matching || matching.status === 404) {
        // If we don't have a match in the cache, use the offline page
        return cache.match("/");
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function(cache) {
    return cache.put(request, response);
  });
}

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", function(response) {
  return caches.open(CACHE).then(function(cache) {
    return cache.addAll([
      '/',
      '/offline',
      '/manifest.json'
    ]);
  });
});