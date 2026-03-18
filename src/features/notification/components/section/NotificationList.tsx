"use client";
import { useSuspenseQuery } from "@tanstack/react-query";

import UnreadNotificationItems from "./UnreadNotificationItems";
import { useNotificationReadActions } from "../../hooks/actions";
import { notificationQueries } from "../../queries";

export default function NotificationList() {
  const { data: notReadMessage } = useSuspenseQuery(
    notificationQueries.unreadList()
  );
  const { handleReadAllNotifications, handleReadNotification } =
    useNotificationReadActions();

  if (notReadMessage.length === 0) {
    return (
      <div className="p-4 text-center text-grey-500 w-full flex items-center justify-center h-full">
        알림이 없습니다.
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto flex-grow flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">읽지 않은 알림</h2>
        <button
          onClick={handleReadAllNotifications}
          className="text-sm text-primary hover:text-primary-light"
        >
          모두 읽음 처리
        </button>
      </div>
      <UnreadNotificationItems
        notifications={notReadMessage}
        onReadNotification={handleReadNotification}
      />
    </div>
  );
}
