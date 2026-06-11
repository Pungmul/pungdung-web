import type { UnreadNotificationData } from "../../types";

interface UnreadNotificationItemsProps {
  notifications: UnreadNotificationData[];
  onReadNotification: (logId: number) => void;
}

export default function UnreadNotificationItems({
  notifications,
  onReadNotification,
}: UnreadNotificationItemsProps) {
  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <button
          key={notification.logId}
          type="button"
          onClick={() => onReadNotification(notification.logId)}
          className="w-full p-3 bg-grey-100 rounded-lg border text-left"
        >
          <div className="font-semibold text-grey-800">{notification.title}</div>
          <div className="text-grey-600 text-sm mt-1">{notification.body}</div>
        </button>
      ))}
    </div>
  );
}
