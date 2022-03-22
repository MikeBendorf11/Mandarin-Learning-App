
const cacheName = Date.now()
const contentToCache = [
  "./",
  "./bootstrap.js",
  "./handwrite-hwime.js",
  "./jquery-1.11.2.min.js",
  "./jsconfig.json",
  "./parseCSV.js",
  "./storageFromBlank.js",
  "./handwrite-chindict.js",
  "./jquery.min.js",
  "./jquery-ui.js",
  "./myScripts.js",
  "./popper.min.js",
  "./storageFunctions.js",
  "../favicon.ico",
  '../images/',
  '../images/windows2.png',
  '../images/mac2.png',
  '../images/linux2.png',
  '../images/loading2.gif',
  '../images/github.png',
  '../images/bg1.png',
  '../css/bootstrap.css',
  '../css/handwrite-style.css',
  '../css/myCss.css'
]

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching ', cacheName);
    await cache.addAll(contentToCache);
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    console.log('ACTIVATE')
    console.log('Avail caches:', keyList)
    console.log('currentCache: ',cacheName)
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return; }
      return caches.delete(key);
    }))
  }));
});