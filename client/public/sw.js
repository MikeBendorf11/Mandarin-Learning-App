
const cacheName = 'worker-4'
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
self.addEventListener('install', (e) => {
  console.log('[SW] Install', cacheName);
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[SW] Caching ', cacheName);
    await cache.addAll(contentToCache);
  })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
  console.log(e)
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[SW] Fetching resource: ${e.request.url}`);
    if (r) return r;
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    console.log(`[SW] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    // console.log('ACTIVATE')
    // console.log('Avail caches:', keyList)
    console.log('[SW] Activate currentCache: ',cacheName)
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return; }
      return caches.delete(key);
    }))
  }));
});