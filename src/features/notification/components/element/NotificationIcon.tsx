"use client";

import React from "react";
import { useRef,useState } from "react";

import { useNotReadMessageCount } from "@/features/home";

import { NotificationIcon } from "@/shared/components/Icons";
import { useClickOutside } from "@/shared/hooks";

import NotificationBadge from "./NotificationBadge";

export default function NotificationIconComponent() {
  const notificationBoxRef = useRef<HTMLDivElement>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { data: notReadMessageCnt } = useNotReadMessageCount();

  useClickOutside({
    ref: notificationBoxRef,
    enabled: notificationOpen,
    onOutsideClick: () => setNotificationOpen(false),
  });

  return (
    <div
      ref={notificationBoxRef}
      className="relative size-8 p-0.5"
      onClick={() => setNotificationOpen(!notificationOpen)}
    >
      <NotificationIcon className="size-full" />
      <div className="absolute bottom-0 right-0">
        <NotificationBadge notReadMessageCnt={notReadMessageCnt || 0} />
      </div>
    </div>
  );
}
