// Cache names
const PRE_CACHE_NAME = 'PRE_V8';
const DYNAMIC_CACHE_NAME = 'DYNAMIC_V1';
// Cache assets
const PRE_CACHE_ASSETS = [
	'/',
	'/index.html',

	'/boards/index.json',

	'/css/form.css',
	'/css/home.css',
	'/css/main.css',
	'/css/posts.css',
	'/css/toast.css',

	'/img/coco_cover.jpg',
	'img/android-chrome-192x192.png',

	'/js/form.js',
	'/js/home.js',
	'/js/posts.js',
	'/js/store.js',
	'/js/toast.js',
];


// cache size limit function
const limitCacheSize = (name, size) => {
	caches.open(name).then(cache => {
		cache.keys().then(keys => {
			if (keys.length > size) {
				cache.delete(keys[0]).then(limitCacheSize(name, size));
			};
		});
	});
};

// install event
self.addEventListener('install', evt => {
	//console.log('service worker installed');
	self.skipWaiting();
	evt.waitUntil(
		caches.open(PRE_CACHE_NAME).then((cache) => {
			console.log('⚙ Service worker: PRE CACHING');
			cache.addAll(PRE_CACHE_ASSETS);
		})
	);
});

// activate event
self.addEventListener('activate', evt => {
	//console.log('service worker activated');
	evt.waitUntil(
		// Delete old caches versions
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => (key !== DYNAMIC_CACHE_NAME) && (key !== PRE_CACHE_NAME))
				.map(key => caches.delete(key))
			);
		})
	);
	self.clients.claim();
});

// fetch events
self.addEventListener('fetch', evt => {
	evt.respondWith(
		(async () => {
			try {
				const networkResponse = await fetch(evt.request);
				return networkResponse;
			} catch (error) {
				// console.log("Fetch failed:", error);
				const cache = await caches.open(PRE_CACHE_NAME);
				const cachedResponse = await cache.match(evt.request.url);
				return cachedResponse;
			}
		})()
	);
	console.log(evt.request.url);
});