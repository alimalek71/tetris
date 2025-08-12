const CACHE_NAME = 'tetris-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './src/css/main.css',
  './src/js/achievements.js',
  './src/js/analytics.js',
  './src/js/board.js',
  './src/js/leaderboard.js',
  './src/js/main.js',
  './src/js/piece.js',
  './src/js/score.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
