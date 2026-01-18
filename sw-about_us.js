const CACHE_NAME = 'uzi-cache-v1';
// Список файлов для кэширования (добавьте сюда свои mp3, когда они появятся)
const ASSETS_TO_CACHE = [
  './about-us.html',
  './assets/css/style.css',
  './assets/css/mobile-menu.css',
  './assets/css/aboutus-section.css',
  './assets/img/photo/1.JPG',
  './assets/img/photo/2.JPG',
  './assets/img/photo/3.JPG',
  './assets/img/photo/4.JPG',
  './assets/img/photo/5.jpg',
  './assets/img/photo/6.png',
  './assets/img/photo/7.png',
  './assets/img/photo/8.JPG',
  './assets/img/icon-burger-menu.png',
  'https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css',
  'https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js'
];

// Установка: сохраняем файлы в кэш
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Активация: удаляем старые версии кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Перехват запросов: сначала смотрим в кэше, если нет — идем в сеть
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});