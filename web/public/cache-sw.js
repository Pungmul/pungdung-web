/**
 * FCM 서비스 워커에서 importScripts로만 로드됨.
 * 동일 오리진/스코프에 SW를 두 개 등록하면 마지막 등록만 활성화되므로 단독 register 하지 않는다.
 *
 * 캐시 이름 버스트: `pungdung-static-v3`
 * `/offline.html`과 Nanum 폰트 precache
 * 이전 `pungdung-static-*` 는 activate에서 삭제한다.
 */

const CACHE_STATIC = "pungdung-static-v3";
const OFFLINE_DOCUMENT = "/offline.html";
const NANUM_FONT = "/fonts/NanumSquareNeo-Variable.woff2";
const PRECACHE_URLS = [OFFLINE_DOCUMENT, NANUM_FONT];

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

function cacheFirstStatic(request) {
  return caches.open(CACHE_STATIC).then((cache) =>
    cache.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (response.ok) {
          void cache.put(request, response.clone());
        }
        return response;
      });
    })
  );
}

function respondWithOfflineDocument() {
  return caches.match(OFFLINE_DOCUMENT).then((cached) => {
    if (cached) return cached;
    return new Response("인터넷 연결이 끊겼습니다.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  });
}

// 문서 navigate는 network-first
// 성공 HTML은 캐시하지 않음
function handleNavigate(request) {
  return fetch(request).catch(() => respondWithOfflineDocument());
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_STATIC)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
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

  if (event.request.mode === "navigate") {
    event.respondWith(handleNavigate(event.request));
    return;
  }

  if (!isStaticPublicPath(url)) return;

  event.respondWith(cacheFirstStatic(event.request));
});
