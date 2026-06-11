"use client";

import { useEffect } from "react";

import { supportsNotification } from "../../lib";
import { notificationPermissionStore } from "../../store/notification-permission.store";

export function useSyncNotificationPermission() {
  useEffect(() => {
    const { setPermissionHydrated } = notificationPermissionStore.getState();
    if (!supportsNotification()) {
      setPermissionHydrated(true);
      return;
    }

    const syncPermission = () => {
      const browserPermission = Notification.permission;
      const state = notificationPermissionStore.getState();
      state.setPermission(browserPermission);
      state.setPermissionHydrated(true);
    };

    syncPermission();
    document.addEventListener("visibilitychange", syncPermission);
    window.addEventListener("focus", syncPermission);

    return () => {
      document.removeEventListener("visibilitychange", syncPermission);
      window.removeEventListener("focus", syncPermission);
    };
  }, []);
}
