"use client";

import { useQuery } from "@tanstack/react-query";

import { NotificationIcon } from "@/shared/components/Icons";

import NotificationBadge from "./NotificationBadge";
import { notificationQueries } from "../../queries";

export default function NotificationIconComponent() {
  const { data: notReadMessageCnt } = useQuery(notificationQueries.unreadCount());

  return (
    <div className="relative size-8 p-0.5">
      <NotificationIcon className="size-full" />
      <div className="absolute bottom-0 right-0">
        <NotificationBadge notReadMessageCnt={notReadMessageCnt || 0} />
      </div>
    </div>
  );
}
