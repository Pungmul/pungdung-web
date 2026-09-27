import Link from "next/link";

import { TicketIcon } from "@heroicons/react/24/solid";

import { BoardIconFilled, ThunderIconFilled } from "@/shared/components/Icons";

import { formatNotificationReceivedAt } from "../../lib/format-notification-received-at";
import { NOTIFICATION_LINK_TYPE } from "../../lib/resolve-notification-href";
import type { NotificationListItem } from "../../types";

type NotificationListItemRowProps = {
  notification: NotificationListItem;
};

function NotificationTypeIcon({ linkType }: { linkType: string | null }) {
  if (linkType === NOTIFICATION_LINK_TYPE.lightningMeeting) {
    return <ThunderIconFilled className="size-full" />;
  }

  if (linkType === NOTIFICATION_LINK_TYPE.performance) {
    return <TicketIcon className="size-full text-blue-200" />;
  }

  return <BoardIconFilled className="size-full" />;
}

export function NotificationListItemRow({
  notification,
}: NotificationListItemRowProps) {
  const className = `flex w-full flex-row items-start p-4 text-left ${
    notification.isRead ? "" : "bg-background"
  }`;
  const receivedLabel = formatNotificationReceivedAt(notification.receivedAt);
  const hasReceivedAt = notification.receivedAt.getTime() > 0;
  const content = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-grey-200 p-1.5 text-grey-800">
        <NotificationTypeIcon linkType={notification.linkType} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1 pl-2">
        <span className="text-[13px] leading-[15px] text-grey-800">
          {notification.title}
        </span>
        {notification.body ? (
          <span className="text-[11px] leading-4 text-grey-600">
            {notification.body}
          </span>
        ) : null}
      </span>
      <time
        dateTime={hasReceivedAt ? notification.receivedAt.toISOString() : undefined}
        className="w-10 shrink-0 text-right text-[9px] leading-[10px] text-grey-500"
      >
        {receivedLabel}
      </time>
    </>
  );

  if (notification.href == null) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={notification.href} className={className}>
      {content}
    </Link>
  );
}
