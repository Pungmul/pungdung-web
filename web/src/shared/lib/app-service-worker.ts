export const APP_SERVICE_WORKER_PATH = "/pungdung-sw.js";

function isAppServiceWorker(registration: ServiceWorkerRegistration) {
  const worker =
    registration.active ?? registration.waiting ?? registration.installing;
  if (!worker) {
    return false;
  }
  try {
    return new URL(worker.scriptURL).pathname === APP_SERVICE_WORKER_PATH;
  } catch {
    return false;
  }
}

export async function getAppServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (
    typeof navigator === "undefined" ||
    !navigator.serviceWorker?.getRegistrations
  ) {
    return null;
  }
  const registrations = await navigator.serviceWorker.getRegistrations();
  return registrations.find(isAppServiceWorker) ?? null;
}

export async function registerAppServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  const existing = await getAppServiceWorkerRegistration();
  if (existing) {
    return existing;
  }
  return navigator.serviceWorker.register(APP_SERVICE_WORKER_PATH);
}
