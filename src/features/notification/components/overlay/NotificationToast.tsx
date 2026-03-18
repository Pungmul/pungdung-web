"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "framer-motion";

import { useView } from "@/shared/lib/view/view-store-provider";

import { notificationStore } from "../../store/notification.store";

const TOAST_AUTO_HIDE_MS = 5000;

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
  const notifications = notificationStore((s) => s.notifications);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const timerMapRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (notifications.length === 0) {
      timerMapRef.current.forEach((timer) => clearTimeout(timer));
      timerMapRef.current.clear();
      setDismissedIds(new Set());
      return;
    }

    notifications.forEach((notification) => {
      const id = getNotificationId(notification);
      if (timerMapRef.current.has(id)) {
        return;
      }

      const timer = setTimeout(() => {
        setDismissedIds((prev) => new Set(prev).add(id));
        timerMapRef.current.delete(id);
      }, TOAST_AUTO_HIDE_MS);
      timerMapRef.current.set(id, timer);
    });
  }, [notifications]);

  useEffect(() => {
    const timerMap = timerMapRef.current;
    return () => {
      timerMap.forEach((timer) => clearTimeout(timer));
      timerMap.clear();
    };
  }, []);

  const items = useMemo(
    () =>
      [...notifications]
        .reverse()
        .map((notification) => ({
          id: getNotificationId(notification),
          notification,
        }))
        .filter(({ id }) => !dismissedIds.has(id)),
    [dismissedIds, notifications]
  );

  const dismiss = (id: string) => {
    const timer = timerMapRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timerMapRef.current.delete(id);
    }
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  const hasNotification = items.length > 0;

  if (!hasNotification) return null;

  const container = document.getElementById("notification-container");
  if (!container) {
    return null;
  }

  return createPortal(
    <AnimatePresence mode="sync">
      {items.map(({ id, notification }) => (
        <motion.div
          key={id}
          layout
          initial={
            view === "desktop" ? { opacity: 0, x: 300 } : { opacity: 0, y: 300 }
          }
          animate={
            view === "desktop" ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }
          }
          exit={
            view === "desktop" ? { opacity: 0, x: 300 } : { opacity: 0, y: 300 }
          }
          transition={{ duration: 0.3 }}
          style={{
            maxWidth: "320px",
            minWidth: "280px",
          }}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">
                  {notification.title}
                </div>
                <div className="text-gray-600 text-sm mt-1 leading-relaxed">
                  {notification.body}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {notification.receivedAt.toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={() => dismiss(id)}
                className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
      ))}
    </AnimatePresence>,
    container
  );
}
