"use client";

import { useCallback } from "react";

import { Toast } from "@/shared/store";

import { invalidateFCMToken, registerFCMToken } from "../../api/client";
import {
  NOTIFICATION_TOGGLE_DISABLED_TOAST_TITLE,
  NOTIFICATION_TOGGLE_ENABLED_TOAST_TITLE,
} from "../../constants";
import {
  disableNotificationWorkflow,
  enableNotificationWorkflow,
} from "../../services/notification-toggle-workflow.service";
import { requestFCMToken } from "../../services/request-permission.service";
import { notificationPermissionStore } from "../../store/notification-permission.store";

/**
 * 알림 토글 성공 시 상태를 동기화하고 Toast.show 로 공용 토스트를 노출한다.
 */
export function useNotificationToggleAction() {
  return useCallback(async (nextEnabled: boolean): Promise<boolean> => {
    const permissionStore = notificationPermissionStore.getState();
    if (permissionStore.togglePending) return permissionStore.enabled;

    permissionStore.setTogglePending(true);

    try {
      if (nextEnabled) {
        const result = await enableNotificationWorkflow({
          requestFCMToken,
          registerFCMToken,
          deviceInfo: navigator.userAgent,
        });

        const state = notificationPermissionStore.getState();
        state.setPermission(result.permission);
        state.setDeviceToken(result.deviceToken);
        state.setEnabled(result.enabled);
        if (result.enabled) {
          Toast.show({ message: NOTIFICATION_TOGGLE_ENABLED_TOAST_TITLE });
        }

        return result.enabled;
      }

      const { deviceToken } = notificationPermissionStore.getState();
      const result = await disableNotificationWorkflow({
        deviceToken,
        invalidateFCMToken,
      });

      const state = notificationPermissionStore.getState();
      state.setDeviceToken(result.deviceToken);
      state.setEnabled(result.enabled);
      if (!result.enabled) {
        Toast.show({ message: NOTIFICATION_TOGGLE_DISABLED_TOAST_TITLE });
      }

      return result.enabled;
    } finally {
      notificationPermissionStore.getState().setTogglePending(false);
    }
  }, []);
}
