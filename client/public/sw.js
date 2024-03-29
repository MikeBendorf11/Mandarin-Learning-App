
const cacheName = 'worker-5'
const contentToCache = [
  "./",
  "./index.html",
  "/static/js/bundle.js",
  "/static/js/1.chunk.js",
  "/static/js/main.chunk.js",
  "./favicon.ico",
  "./font/Chonburi-Regular.ttf",
  "./font/ionicons-2.0.1/ionicons.ttf",
  "./scripts/eruda.js",
  "./scripts/bootstrap.js",
  "./scripts/handwrite-hwime.js",
  "./scripts/jquery-1.11.2.min.js",
  "./scripts/jsconfig.json",
  "./scripts/parseCSV.js",
  "./scripts/storageFromBlank.js",
  "./scripts/handwrite-chindict.js",
  "./scripts/jquery.min.js",
  "./scripts/jquery-ui.js",
  "./scripts/myScripts.js",
  "./scripts/popper.min.js",
  "./scripts/storageFunctions.js",
  './images/windows2.png',
  './images/mac2.png',
  './images/linux2.png',
  './images/loading2.gif',
  './images/github.png',
  './images/bg1.png',
  './css/bootstrap.css',
  './css/handwrite-style.css',
  './css/myCss.css'
]
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(contentToCache)
          .then(() => self.skipWaiting());
    })
  );
});

// Fetching content using Service Worker
self.addEventListener('fetch', event => {
  console.log('[WW fetch]', event.request)
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(e=>console.log('error fetch', e))
  );
});

self.addEventListener('activate', event => {
//  event.waitUntil(self.clients.claim());
  event.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return self.clients.claim(); }
      return caches.delete(key);
    }))
  }));
});
