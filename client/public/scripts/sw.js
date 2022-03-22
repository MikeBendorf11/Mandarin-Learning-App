
const cacheName = 'worker-1'
const contentToCache = [
  "scripts/",
  "scripts/bootstrap.js",
  "scripts/handwrite-hwime.js",
  "scripts/jquery-1.11.2.min.js",
  "scripts/jsconfig.json",
  "scripts/parseCSV.js",
  "scripts/storageFromBlank.js",
  "scripts/handwrite-chindict.js",
  "scripts/jquery.min.js",
  "scripts/jquery-ui.js",
  "scripts/myScripts.js",
  "scripts/popper.min.js",
  "scripts/storageFunctions.js",
  "favicon.ico",
  'images/',
  'images/windows2.png',
  'images/mac2.png',
  'images/linux2.png',
  'images/loading2.gif',
  'images/github.png',
  'images/bg1.png',
  'css/bootstrap.css',
  'css/handwrite-style.css',
  'css/myCss.css'
]

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install', cacheName);
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