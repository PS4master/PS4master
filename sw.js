// نام کش را برای نسخه‌بندی تعریف کنید. (اگر در آینده فایل‌ها را تغییر دادید، این عدد را افزایش دهید.)
const CACHE_NAME = 'ps4-host-cache-v3';

// لیست تمام فایل‌هایی که می‌خواهید کش شوند
const urlsToCache = [
    '/', // صفحه اصلی (اگر آدرس بدون نام فایل باشد)
    'ps4.html',
    'style.css', // اگر استایل‌ها در فایل جدا هستند، نام آن را اینجا بیاورید.
    // آیکون‌ها و تصاویر - اطمینان حاصل کنید نام‌ها دقیقاً همان چیزی باشد که در پروژه شما هست.
    'Ps4.png',
    'host.png',
    'goldhen.png',
    'find.png',
    'pngfind.com-ps4-logo-png-983235.png',
    'gogo.png',
    'no.png'
    // نیازی به Tailwind.css نیست چون از CDN می‌آید و خود مرورگر آن را کش می‌کند.
];

// ۱. نصب Service Worker (اولین بازدید): ذخیره تمام فایل‌های ضروری در کش
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // اضافه کردن تمام فایل‌ها به کش
                return cache.addAll(urlsToCache);
            })
    );
});

// ۲. واکشی (Fetch) منابع: ابتدا کش را بررسی کن، اگر نبود از شبکه بگیر
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // اگر فایل در کش وجود داشت، از کش برگردان (بارگذاری آفلاین)
                if (response) {
                    return response;
                }
                // اگر در کش نبود، از شبکه واکشی کن
                return fetch(event.request);
            })
    );
});

// ۳. فعال‌سازی Service Worker: حذف کش‌های قدیمی (برای اطمینان از به روز بودن)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // حذف کش‌هایی که در لیست سفید نیستند (نسخه‌های قدیمی)
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});