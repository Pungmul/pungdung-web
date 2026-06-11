"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "framer-motion";

import { useView } from "@/shared/lib/view/view-store-provider";

import {
  NOTIFICATION_AUTO_HIDE_MS,
  NOTIFICATION_CONTAINER_ID,
  NOTIFICATION_MOTION,
} from "../../constants/notification-banner";
import { notificationStore } from "../../store";

function getNotificationId({
  title,
  body,
  receivedAt,
}: {
  title: string;
  body: string;
  receivedAt: Date;
}) {
  return `${receivedAt.getTime()}-${title}-${body}`;
}

export default function NotificationToast() {
  const view = useView();
  const activeNotification = notificationStore((s) => s.notifications[0]);
  const dismissNotification = notificationStore((s) => s.dismissNotification);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const activeId = activeNotification
    ? getNotificationId(activeNotification)
    : undefined;

  useEffect(() => {
    const el = document.getElementById(NOTIFICATION_CONTAINER_ID);
    setContainer(el);
  }, []);

  useEffect(() => {
    if (!activeId) return;

    const timer = setTimeout(() => {
      dismissNotification();
    }, NOTIFICATION_AUTO_HIDE_MS);

    return () => clearTimeout(timer);
  }, [activeId, dismissNotification]);

  if (!container) return null;

  const isDesktop = view === "desktop";
  const motionInitial = isDesktop
    ? { opacity: 1, x: NOTIFICATION_MOTION.desktopOffsetX }
    : { opacity: 1, y: NOTIFICATION_MOTION.mobileOffsetY };
  const motionAnimate = isDesktop
    ? { opacity: 1, x: 0, y: 0 }
    : { opacity: 1, x: 0, y: 0 };
  const motionExit = isDesktop
    ? { opacity: 0, x: NOTIFICATION_MOTION.desktopOffsetX }
    : { opacity: 0, y: NOTIFICATION_MOTION.mobileOffsetY };

  return createPortal(
    <AnimatePresence mode="wait">
      {activeNotification && activeId ? (
        <motion.div
          key={activeId}
          initial={motionInitial}
          animate={motionAnimate}
          exit={motionExit}
          transition={{
            duration: NOTIFICATION_MOTION.durationSec,
            opacity: {
              duration: NOTIFICATION_MOTION.exitOpacityDuration,
              ease: "easeOut",
            },
          }}
          className="w-full"
        >
          <div className="rounded-lg border border-grey-200 bg-background p-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm font-semibold text-grey-900">
                  {activeNotification.title}
                </div>
                <div className="mt-1 text-sm leading-relaxed text-grey-600">
                  {activeNotification.body}
                </div>
                <div className="mt-2 text-xs text-grey-400">
                  {activeNotification.receivedAt.toLocaleTimeString()}
                </div>
              </div>
              <button
                type="button"
                aria-label="알림 닫기"
                onClick={dismissNotification}
                className="ml-3 text-grey-400 transition-colors hover:text-grey-600"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    container
  );
}
