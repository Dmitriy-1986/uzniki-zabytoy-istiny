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

self.addEventListener('fetch', (event) => {
  // Игнорируем запросы не с нашего домена (например, расширения или аналитику)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Проверка на музыку (MP3)
        const isMusic = event.request.url.match(/\.mp3$/);

        // Если это музыка и пришел статус 206 (Partial Content)
        if (isMusic && response.status === 206) {
          // Перезапрашиваем файл целиком (статус 200), чтобы сохранить в кеш
          return fetch(event.request.url).then(fullResponse => {
            const responseToCache = fullResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return fullResponse;
          });
        }

        // Для обычных файлов (200 OK) сохраняем как обычно
        if (response.status === 200 && (isMusic || event.request.url.match(/\.(?:jpg|png|jpeg)$/))) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      }).catch(() => {
        // Это предотвратит ошибки в консоли, если интернет пропал, 
        // а файла еще нет в кеше
        console.log('Файл пока недоступен оффлайн');
      });
    })
  );
});