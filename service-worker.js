const CACHE_NAME = 'hoa-don-manh-hung-v1';
const ASSETS_TO_CACHE = [
    './index.html',
    './manifest.json',
    './assets/css/style.css',
    './assets/js/vietnameseMoney.js',
    './assets/js/formatter.js',
    './assets/js/calculator.js',
    './assets/js/validation.js',
    './assets/js/storage.js',
    './assets/js/state.js',
    './assets/components/customerForm.js',
    './assets/components/productRow.js',
    './assets/components/productTable.js',
    './assets/components/toolbar.js',
    './assets/components/preview.js',
    './assets/js/printer.js',
    './assets/js/app.js'
];

// Cài đặt Service Worker và lưu cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching static assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Kích hoạt và dọn dẹp cache cũ
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Lấy dữ liệu từ Cache khi Offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).catch(() => {
                // Fallback nếu không có mạng
                return caches.match('./index.html');
            });
        })
    );
});
