"use client";

import { Suspense } from "@suspensive/react";

import { Spinner } from "@/shared";

import { NotificationList as NotificationListImpl } from "./NotificationList";
import { NotificationListErrorBoundary } from "./NotificationListErrorBoundary";

export function NotificationList() {
  return (
    <NotificationListErrorBoundary>
      <Suspense
        clientOnly
        fallback={
          <div className="flex h-full items-center justify-center">
            <Spinner size={32} />
          </div>
        }
      >
        <NotificationListImpl />
      </Suspense>
    </NotificationListErrorBoundary>
  );
}
