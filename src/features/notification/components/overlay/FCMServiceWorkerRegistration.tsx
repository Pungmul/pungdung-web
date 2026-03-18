"use client";

import { useRegisterFCMServiceWorker } from "../../hooks/actions";

/**
 * Service Worker 등록을 담당하는 컴포넌트.
 * `public/pungdung-sw.js`가 `importScripts`로 `cache-sw.js`·`pungdung-fcm-background.js`를 묶는다.
 *
 * 렌더 결과 없음 (null 반환)
 */
export default function FCMServiceWorkerRegistration() {
  useRegisterFCMServiceWorker();
  return null;
}
