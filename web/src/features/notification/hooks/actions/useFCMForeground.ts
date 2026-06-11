"use client";

import { useEffect } from "react";

import { onMessage } from "firebase/messaging";

import { supportsNotification } from "../../lib";
import { getFirebaseMessaging } from "../../services/firebase-client.service";
import { notificationStore } from "../../store/notification.store";

export function useFCMForeground() {
  const addNotification = notificationStore((s) => s.addNotification);

  useEffect(() => {
    if (!supportsNotification()) return;

    const messaging = getFirebaseMessaging();
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      const notification = payload.notification;
      if (!notification) return;

      addNotification({
        title: notification.title || "새 알림",
        body: notification.body || "",
        receivedAt: new Date(),
      });
    });

    return unsubscribe;
  }, [addNotification]);
}
