"use client";

import { useEffect } from "react";

import {
  fetchMyFCMTokens,
  invalidateFCMToken,
  registerFCMToken,
} from "../../api/client";
import { notificationPermissionStore } from "../../store/notification-permission.store";

export function useSyncFCMTokenWithPermission() {
  const enabled = notificationPermissionStore((state) => state.enabled);
  const permission = notificationPermissionStore((state) => state.permission);
  const permissionHydrated = notificationPermissionStore(
    (state) => state.permissionHydrated
  );
  const deviceToken = notificationPermissionStore((state) => state.deviceToken);
  const setEnabled = notificationPermissionStore((state) => state.setEnabled);
  const setDeviceToken = notificationPermissionStore((state) => state.setDeviceToken);

  useEffect(() => {
    let cancelled = false;

    const syncToken = async () => {
      if (!enabled) {
        if (!deviceToken) return;
        const invalidated = await invalidateFCMToken(deviceToken);
        if (!cancelled && invalidated) {
          setDeviceToken(null);
        }
        return;
      }

      if (permission !== "granted") {
        if (!permissionHydrated) {
          return;
        }
        if (!cancelled) {
          setEnabled(false);
        }
        return;
      }

      if (!deviceToken) return;

      const myTokens = await fetchMyFCMTokens();
      if (cancelled) return;

      if (myTokens.includes(deviceToken)) return;
      const registered = await registerFCMToken(deviceToken, navigator.userAgent);
      if (cancelled || registered) return;

      // 재등록 실패 시 enabled/deviceToken을 함께 내려서
      // 직후 invalidate가 연쇄적으로 실행되는 부작용을 막는다.
      setEnabled(false);
      setDeviceToken(null);
    };

    void syncToken();

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    permission,
    permissionHydrated,
    deviceToken,
    setEnabled,
    setDeviceToken,
  ]);
}
