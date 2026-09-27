import { WarningCircleIcon } from "@/shared/components/Icons";

import type { NotificationListItem } from "../../../types";
import { NotificationListItemRow } from "../NotificationListItemRow";

type NotificationListViewProps = {
  notifications: NotificationListItem[];
};

export function NotificationListView({
  notifications,
}: NotificationListViewProps) {
  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  );
  const readNotifications = notifications.filter(
    (notification) => notification.isRead
  );
  const showsPreviousLabel = readNotifications.length > 0;

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-grey-100">
      {notifications.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-grey-500">
          알림이 없습니다.
        </div>
      ) : (
        <div className="flex flex-col">
          {unreadNotifications.map((notification) => (
            <NotificationListItemRow
              key={notification.logId}
              notification={notification}
            />
          ))}
          {showsPreviousLabel ? (
            <p className="w-full p-3 text-[13px] leading-4 text-grey-600">
              이전 알림
            </p>
          ) : null}
          {readNotifications.map((notification) => (
            <NotificationListItemRow
              key={notification.logId}
              notification={notification}
            />
          ))}
        </div>
      )}
      <div className="flex flex-row items-center justify-center gap-1 py-2 text-grey-500">
        <WarningCircleIcon className="size-4 shrink-0" aria-hidden />
        <p className="text-[11px] leading-4">
          10일 이상된 알림은 자동으로 삭제돼요
        </p>
      </div>
    </div>
  );
}
