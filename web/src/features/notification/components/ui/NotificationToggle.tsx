"use client";

import { useCallback } from "react";

import { Toggle } from "@/shared/components/form/Toggle";

import { useNotificationToggleAction } from "../../hooks/actions";
import { notificationPermissionStore } from "../../store/notification-permission.store";

export default function NotificationToggle() {
  const enabled = notificationPermissionStore((state) => state.enabled);
  const pending = notificationPermissionStore((state) => state.togglePending);
  const toggleNotification = useNotificationToggleAction();

  const handleToggle = useCallback(
    async (nextChecked: boolean) => {
      if (pending) return;
      await toggleNotification(nextChecked);
    },
    [pending, toggleNotification]
  );

  return (
    <div className="flex flex-row items-center justify-between">
      <h2 className="text-base font-semibold text-grey-800">알림 설정</h2>
      <div
        className={pending ? "pointer-events-none opacity-70" : undefined}
        aria-busy={pending}
      >
        <Toggle checked={enabled} toggle={handleToggle} />
      </div>
    </div>
  );
}
