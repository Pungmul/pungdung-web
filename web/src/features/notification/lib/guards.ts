/**
 * 브라우저 환경에서 알림 관련 API 지원 여부를 체크합니다.
 * SSR/미지원 환경에서 안전하게 사용할 수 있습니다.
 */

const isBrowser = () => typeof window !== "undefined";

/** Notification API 지원 여부 (알림 UI 표시용) */
export const supportsNotification = () =>
  isBrowser() && "Notification" in window;

/** FCM 푸시 알림 지원 여부 (Notification + ServiceWorker) */
export const supportsPushNotification = () =>
  isBrowser() &&
  "Notification" in window &&
  "serviceWorker" in navigator;
