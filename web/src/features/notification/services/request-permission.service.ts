import { getToken } from "firebase/messaging";

import { registerAppServiceWorker } from "@/shared/lib/app-service-worker";

import { supportsPushNotification } from "../lib";

import { getFirebaseMessaging } from "./firebase-client.service";

async function waitUntilServiceWorkerActive(
  registration: ServiceWorkerRegistration
) {
  if (registration.active) return;

  const worker = registration.installing ?? registration.waiting;
  if (!worker) return;

  if (worker.state === "activated") return;

  await new Promise<void>((resolve) => {
    const onStateChange = () => {
      if (worker.state === "activated" || worker.state === "redundant") {
        worker.removeEventListener("statechange", onStateChange);
        resolve();
      }
    };
    worker.addEventListener("statechange", onStateChange);
  });
}

export interface RequestFCMTokenResult {
  permission: NotificationPermission;
  token: string | null;
}

async function fetchFCMTokenWithRegistration(): Promise<string | null> {
  const messaging = getFirebaseMessaging();
  if (!messaging) return null;

  const registration = await registerAppServiceWorker();
  if (!registration) return null;
  await waitUntilServiceWorkerActive(registration);

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    serviceWorkerRegistration: registration,
  });

  return token ?? null;
}

/** 이미 알림 권한이 granted일 때만 토큰을 가져옵니다 (앱 시작 시 등록용). */
export async function getFCMTokenWhenGranted(): Promise<string | null> {
  if (!supportsPushNotification()) return null;
  if (Notification.permission !== "granted") return null;

  return fetchFCMTokenWithRegistration();
}

export async function requestFCMToken(): Promise<RequestFCMTokenResult> {
  if (!supportsPushNotification()) {
    return { permission: "default", token: null };
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("알림 권한 거부");
    return { permission, token: null };
  }

  const token = await fetchFCMTokenWithRegistration();
  return { permission, token };
}
