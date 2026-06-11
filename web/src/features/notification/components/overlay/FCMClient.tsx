"use client";

import {
  useFCMForeground,
  useRegisterFCMTokenIfGranted,
  useSyncFCMTokenWithPermission,
  useSyncNotificationPermission,
} from "../../hooks/actions";

export default function FCMClient() {
  useFCMForeground();
  useSyncNotificationPermission();
  useRegisterFCMTokenIfGranted();
  useSyncFCMTokenWithPermission();

  return null;
}
