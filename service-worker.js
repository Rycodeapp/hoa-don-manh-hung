const CACHE_NAME = 'hoa-don-manh-hung-v2';
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

// Cài đặt Service Worker và lập tức kích hoạt phiên bản mới
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching updated static assets v2');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Kích hoạt và dọn dẹp TOÀN BỘ cache cũ
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Lấy dữ liệu từ Network trước, nếu mất mạng mới lấy Cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return caches.match('./index.html');
                });
            })
    );
});
