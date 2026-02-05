"use client";

import {
  useFCMForeground,
  useRegisterFCMTokenIfGranted,
  useSyncNotificationPermission,
} from "../../hooks";

export default function FCMClient() {
  useFCMForeground();
  useSyncNotificationPermission();
  useRegisterFCMTokenIfGranted();

  return null;
}
