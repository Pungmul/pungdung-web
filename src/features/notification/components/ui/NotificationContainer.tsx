"use client";

import { cn } from "@/shared/lib";

import { NOTIFICATION_CONTAINER_ID } from "../../constants/notification-banner";

export default function NotificationContainer() {
  return (
    <div
      id={NOTIFICATION_CONTAINER_ID}
      className={cn(
        "pointer-events-none fixed z-50 flex w-full flex-col gap-2 [&>*]:pointer-events-auto",
        "inset-x-0 top-0 px-4 pt-[max(0.75rem,env(safe-area-inset-top))]",
        "md:inset-x-auto md:left-auto md:right-4 md:top-auto md:bottom-4 md:max-w-80 md:items-end md:px-0 md:pt-0"
      )}
    />
  );
}
