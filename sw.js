// vb4f03b — increment version to bust all previous caches
const CACHE = 'webbins-b4f03b';
const ASSETS = ['./', './index.html', './data.json?v=b4f03b'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request).then(res => {
        const rc = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, rc));
        return res;
      }))
  );
});
