"use client";

import { useEffect } from "react";

import {
  FCM_SERVICE_WORKER_PATH,
  getFCMServiceWorkerRegistration,
} from "../../services/get-fcm-service-worker-registration.service";

/**
 * FCM용 Service Worker를 등록하는 훅.
 * firebase-messaging-sw.js는 FCM 푸시 알림 수신을 위한 전용 SW.
 * 앱 전역에서 한 번만 실행되어야 하므로 루트 레이아웃에서 사용 권장.
 * 이미 FCM SW가 등록되어 있으면 재등록하지 않음.
 */
export function useRegisterFCMServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    getFCMServiceWorkerRegistration()
      .then((existing) => {
        if (existing) return;
        return navigator.serviceWorker.register(FCM_SERVICE_WORKER_PATH);
      })
      .then((regResult) => {
        if (regResult) {
          console.log("FCM Service Worker registered:", regResult);
        }
      })
      .catch((err) => {
        console.error("FCM Service Worker registration failed:", err);
      });
  }, []);
}
