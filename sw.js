const CACHE_NAME = 'uzi-universal-cache-v1';

const PRECACHE = [
  './',
  './index.html',
  './about-us.html',
  './music.html',
  './contacts.html',
  './assets/css/style.css',
  './assets/css/mobile-menu.css',
  './assets/css/content-section.css',
  './assets/css/music-section.css',
  './assets/css/aboutus-section.css',
  './assets/img/uzi-logo-removebg.png',
  './assets/img/icon-burger-menu.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        const isMusic = event.request.url.match(/\.mp3$/);

        if (isMusic && response.status === 206) {
          return fetch(event.request.url).then(fullResponse => {
            const responseToCache = fullResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return fullResponse;
          });
        }

        if (response.status === 200 && (isMusic || event.request.url.match(/\.(?:jpg|png|jpeg)$/))) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      }).catch(() => {
        console.log('Файл пока недоступен оффлайн');
      });
    })
  );
});