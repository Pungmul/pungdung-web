"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useAcknowledgeNotificationList } from "../../../hooks/actions";
import { notificationQueries } from "../../../queries";
import UnreadNotificationItems from "../UnreadNotificationItems";

export function NotificationList() {
  const { data: notifications } = useSuspenseQuery(notificationQueries.list());
  useAcknowledgeNotificationList();

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-grey-500 w-full flex items-center justify-center h-full">
        알림이 없습니다.
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto flex-grow flex flex-col">
      <UnreadNotificationItems notifications={notifications} />
    </div>
  );
}
