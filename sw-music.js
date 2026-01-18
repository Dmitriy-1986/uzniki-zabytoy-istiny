const CACHE_NAME = 'uzi-media-cache-v1';

// Файлы, которые нужны сразу (интерфейс)
const PRECACHE_ASSETS = [
  './music.html',
  './assets/css/style.css',
  './assets/css/music-section.css',
  './assets/js/script.js',
  './assets/img/play-button.png',
  './assets/img/pause-button.png',
  './assets/img/volume-min.png',
  './assets/img/volume-max.png'
];

// Установка: кешируем только основу сайта
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map(key => { if (key !== CACHE_NAME) return caches.delete(key); })
    ))
  );
});

// Умный перехват запросов
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Стратегия для музыки и картинок: ищем в кеше, если нет - качаем и сохраняем
  if (url.pathname.includes('/assets/music/') || url.pathname.includes('/assets/img/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Возвращаем из кеша
        }
        return fetch(event.request).then((response) => {
          // Проверяем, что ответ успешный, прежде чем кешировать
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
    );
  } else {
    // Для остальных файлов (HTML/CSS) - обычный запрос с фолбеком на кеш
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  }
});