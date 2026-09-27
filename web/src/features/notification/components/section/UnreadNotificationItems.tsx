import Link from "next/link";

import type { NotificationListItem } from "../../types";

interface UnreadNotificationItemsProps {
  notifications: NotificationListItem[];
}

export default function UnreadNotificationItems({
  notifications,
}: UnreadNotificationItemsProps) {
  return (
    <div className="space-y-3">
      {notifications.map((notification) => {
        const content = (
          <>
            <div className="font-semibold text-grey-800">{notification.title}</div>
            <div className="text-grey-600 text-sm mt-1">{notification.body}</div>
          </>
        );
        const className = "block w-full p-3 bg-grey-100 rounded-lg border text-left";

        return notification.href ? (
          <Link key={notification.logId} href={notification.href} className={className}>
            {content}
          </Link>
        ) : (
          <div key={notification.logId} className={className}>{content}</div>
        );
      })}
    </div>
  );
}
