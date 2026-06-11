/**
 * 앱 서비스 워커 단일 진입점 (FCM + 정적 에셋 캐시).
 * API 키는 importScripts 순서 마지막의 `pungdung-fcm-background.js` 에서 주입된다.
 */

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js"
);

importScripts("/cache-sw.js");
importScripts("/pungdung-fcm-background.js");
