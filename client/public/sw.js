
const cacheName = 'worker-1'
const contentToCache = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/scripts/",
  "/scripts/bootstrap.js",
  "/scripts/handwrite-hwime.js",
  "/scripts/jquery-1.11.2.min.js",
  "/scripts/jsconfig.json",
  "/scripts/parseCSV.js",
  "/scripts/storageFromBlank.js",
  "/scripts/handwrite-chindict.js",
  "/scripts/jquery.min.js",
  "/scripts/jquery-ui.js",
  "/scripts/myScripts.js",
  "/scripts/popper.min.js",
  "/scripts/storageFunctions.js",
  '/images/',
  '/images/windows2.png',
  '/images/mac2.png',
  '/images/linux2.png',
  '/images/loading2.gif',
  '/images/github.png',
  '/images/bg1.png',
  '/css/',
  '/css/bootstrap.css',
  '/css/handwrite-style.css',
  '/css/myCss.css'
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
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(e.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
    })
  );
});