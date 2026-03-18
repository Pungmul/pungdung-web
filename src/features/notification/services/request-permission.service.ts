import { getToken } from "firebase/messaging";

import { supportsPushNotification } from "../lib";

import { getFirebaseMessaging } from "./firebase-client.service";
import {
  FCM_SERVICE_WORKER_PATH,
  getFCMServiceWorkerRegistration,
} from "./get-fcm-service-worker-registration.service";

export interface RequestFCMTokenResult {
  permission: NotificationPermission;
  token: string | null;
}

async function fetchFCMTokenWithRegistration(): Promise<string | null> {
  const messaging = getFirebaseMessaging();
  if (!messaging) return null;

  await navigator.serviceWorker.ready;
  let registration = await getFCMServiceWorkerRegistration();
  if (!registration) {
    registration = await navigator.serviceWorker.register(
      FCM_SERVICE_WORKER_PATH
    );
  }

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
