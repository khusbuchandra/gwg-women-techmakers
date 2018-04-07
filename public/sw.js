// Set this to true for production
//import idb from 'idb';
//  self.importScripts('/idb.js');
//  self.importScripts('/idbTest.js');

const doCache = false;

const CACHE_NAME = 'maapa-cache-v6';

const urlsToCache = [
  '/',
  '/static/js/main.cfd8da69.js',
  '/static/css/main.181bbb8b.css',
  '/index.html',
  '/static/js/bundle.js'
];


// The first time the user starts up the app, 'install' is triggered.
self.addEventListener('install', function (event) {
  // if (doCache) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache)
      })
  );
  // }
});

// When the webpage goes to fetch files, we intercept that request and serve up the matching files
// if we have them
self.addEventListener('fetch', function (event) {
  const requestUrl = new URL(event.request.url)
  // if (requestUrl.pathname.startsWith('/maps/api/staticmap')) {
  
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function (response) {
          if (requestUrl.pathname.startsWith('/maps/api/staticmap')) {
          cache.put(event.request, response.clone())
          }
          return response;
        })
          .catch(function () {
            // console.log('in catch fetch for request: ', requestUrl.pathname);
            if (requestUrl.pathname.startsWith('/maps/api/js')) {
              return caches.match('maps/api/staticmap')
            }
          })
      })
    })
  )
  // } 
});

//This is caching the static map on the first load, Called "Cache then network" recipe
// self.addEventListener('fetch', function (event) {
//   const requestUrl = new URL(event.request.url)

//   if (requestUrl.pathname.startsWith('/maps/api/staticmap')) {
//     console.log("caching static map")
//     event.respondWith(
//       caches.open(CACHE_NAME).then(function(cache) {
//         return cache.match(event.request).then(function(response) {
//           return response || fetch(event.request).then(function(response) {
//             cache.put(event.request, response.clone())
//             return response
//           })
//         })
//       })
//     )
//   }
// })


//this is hijacking the request to the maps api, and if it fails, it serves the static image (happinesssssssss)
// self.addEventListener('fetch', function(event) {
//   const requestUrl = new URL(event.request.url)

//   if (requestUrl.pathname.startsWith('/maps/api/js')) {
//     event.respondWith(
//       fetch(event.request).catch(function() {
//         return caches.match('maps/api/staticmap')
//       })
//     )
//   }
// })



self.addEventListener("activate", function (event) {
  self.clients.claim();

  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        }))
      )
  );
});