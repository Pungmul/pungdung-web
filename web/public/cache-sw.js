/**
 * FCM 서비스 워커에서 importScripts로만 로드됨.
 * 동일 오리진/스코프에 SW를 두 개 등록하면 마지막 등록만 활성화되므로 단독 register 하지 않는다.
 */

const CACHE_STATIC = "pungdung-static-v1";

/** @param {URL} url */
function isSameOriginAsset(url) {
  return url.origin === self.location.origin;
}

/** @param {URL} url */
function isStaticPublicPath(url) {
  const p = url.pathname;
  return (
    p.startsWith("/fonts/") ||
    p.startsWith("/icons/") ||
    p.startsWith("/logos/")
  );
}

/** @param {URL} url */
function shouldBypassCache(url) {
  const p = url.pathname;
  return (
    p.startsWith("/api/") ||
    p.startsWith("/_next/") ||
    p.startsWith("/_vercel/")
  );
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name.startsWith("pungdung-static-") && name !== CACHE_STATIC) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return;
  }

  if (!isSameOriginAsset(url)) return;

  if (shouldBypassCache(url)) return;

  if (!isStaticPublicPath(url)) return;

  event.respondWith(
    caches.open(CACHE_STATIC).then((cache) =>
      cache.match(event.request).then((cached) => {
        if (cached) return cached;

        return fetch(event.request).then((response) => {
          if (response.ok) {
            void cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    )
  );
});
