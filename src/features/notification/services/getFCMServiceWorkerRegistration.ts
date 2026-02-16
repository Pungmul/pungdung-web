/** 푸시(FCM)·정적 캐시를 묶은 앱 단일 진입점 (`public/pungdung-sw.js`) */
export const FCM_SERVICE_WORKER_PATH = "/pungdung-sw.js";

/**
 * 이 앱이 등록한 푸시용 Service Worker(`/pungdung-sw.js`) 여부.
 */
function isFCMRegistration(reg: ServiceWorkerRegistration): boolean {
  const sw = reg.active ?? reg.waiting ?? reg.installing;
  if (!sw) return false;
  try {
    const pathname = new URL(sw.scriptURL).pathname;
    return pathname === FCM_SERVICE_WORKER_PATH;
  } catch {
    return false;
  }
}

/**
 * 등록되어 있던 푸시용 등록(`/pungdung-sw.js`) 반환.
 * 없으면 null.
 */
export async function getFCMServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (
    typeof navigator === "undefined" ||
    !navigator.serviceWorker?.getRegistrations
  ) {
    return null;
  }
  const registrations = await navigator.serviceWorker.getRegistrations();
  return registrations.find(isFCMRegistration) ?? null;
}
