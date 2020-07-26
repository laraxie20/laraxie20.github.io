importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
 
if (workbox) {
	console.log(`Workbox berhasil dimuat`);
} else {
	console.log(`Workbox gagal dimuat`);
}

workbox.precaching.precacheAndRoute([
	{ url: '/', revision: '1' },
	{ url: '/manifest.json', revision: '1' },
	{ url: '/favicon.ico', revision: '1' },
	{ url: '/css/style.css', revision: '1' },
	{ url: '/css/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2', revision: '1' },
	{ url: '/css/materialize.min.css', revision: '1' },
	{ url: '/img/icons/icon-72x72.png', revision: '1' },
	{ url: '/img/icons/icon-96x96.png', revision: '1' },
	{ url: '/img/icons/icon-128x128.png', revision: '1' },
	{ url: '/img/icons/icon-144x144.png', revision: '1' },
	{ url: '/img/icons/icon-152x152.png', revision: '1' },
	{ url: '/img/icons/icon-192x192.png', revision: '1' },
	{ url: '/img/icons/icon-384x384.png', revision: '1' },
	{ url: '/img/icons/icon-512x512.png', revision: '1' },
	{ url: '/img/logo.png', revision: '1' },
	{ url: '/img/pl-logo.png', revision: '1' },
	{ url: '/img/sidebar.jpg', revision: '1' },
	{ url: '/img/firman.jpg', revision: '1' },
	{ url: '/img/idcamp.jpg', revision: '1' },
	{ url: '/img/dicoding.jpg', revision: '1' },
	{ url: '/js/api.js', revision: '1' },
	{ url: '/js/db.js', revision: '1' },
	{ url: '/js/main.js', revision: '1' },
	{ url: '/js/nav.js', revision: '1' },
	{ url: '/js/idb.js', revision: '1' },
	{ url: '/js/materialize.min.js', revision: '1' },
	{ url: '/index.html', revision: '1' },
	{ url: '/nav.html', revision: '1' },
	{ url: '/team.html', revision: '1' },
	{ url: '/pages/home.html', revision: '1' },
	{ url: '/pages/list.html', revision: '1' },
	{ url: '/pages/favorite.html', revision: '1' },
	{ url: '/pages/about.html', revision: '1' },
]);

workbox.routing.registerRoute(
	/\/team.html/g,
	workbox.strategies.staleWhileRevalidate({
		cacheName: 'si-teamdetail'
	})
);

workbox.routing.registerRoute(
	/^https:\/\/api\.football\-data\.org\/v2\//,
	workbox.strategies.staleWhileRevalidate({
		cacheName: "si-api",
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 120,
				maxAgeSeconds: 30 * 24 * 60 * 60
			})
		]
	})
);

workbox.routing.registerRoute(
	/\.(?:png|gif|jpg|jpeg|svg|ico)$/,
	workbox.strategies.cacheFirst({
		cacheName: "si-image",
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 25,
				maxAgeSeconds: 30 * 24 * 60 * 60
			})
		]
	})
);

self.addEventListener('push', function(event) {
	var body;
	if (event.data) {
		body = event.data.text();
	} else {
		body = 'This is for node/push from dev tools';
	}
	var options = {
		body: body,
		icon: 'img/icons/icon-152x152.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1
		}
	};
	event.waitUntil(
		self.registration.showNotification('Push Notification', options)
	);
});