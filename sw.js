const CACHE_NAME = 'uzi-universal-cache-v1';

// 1. Что кешируем сразу (каркас сайта)
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

// 2. Универсальный перехватчик
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((response) => {
        // Если это музыка или фото из слайдера — кешируем после первого открытия
        if (event.request.url.match(/\.(?:mp3|jpg|jpeg|png|JPG)$/)) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      });
    })
  );
});