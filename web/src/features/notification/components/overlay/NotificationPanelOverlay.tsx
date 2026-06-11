"use client";

import { type RefObject } from "react";

import { Suspense } from "@suspensive/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

import { Spinner } from "@/shared";
import { Header } from "@/shared/components/layout/Header";

import NotificationList from "../section/NotificationList";

interface NotificationPanelOverlayProps {
  isOpen: boolean;
  tabsWidth: number;
  onClose: () => void;
  overlayRef: RefObject<HTMLDivElement | null>;
}

const NOTIFICATION_PANEL_WIDTH = 360;

export default function NotificationPanelOverlay({
  isOpen,
  tabsWidth,
  onClose,
  overlayRef,
}: NotificationPanelOverlayProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key="notification-overlay"
          ref={overlayRef}
          initial={{ x: -NOTIFICATION_PANEL_WIDTH + tabsWidth }}
          animate={{ x: tabsWidth }}
          exit={{ x: -NOTIFICATION_PANEL_WIDTH + tabsWidth }}
          transition={{ duration: 0.5 }}
          style={{ width: NOTIFICATION_PANEL_WIDTH }}
          className="md:flex hidden fixed left-0 top-0 bottom-0 h-app flex-shrink-0 flex-col bg-background border backdrop-blur-sm z-20"
        >
          <div className="flex flex-col h-full w-full min-h-0">
            <Header
              title="알림"
              isBackBtn={false}
              rightBtn={
                <div
                  className="flex size-9 cursor-pointer items-center justify-center"
                  onClick={onClose}
                >
                  <XMarkIcon className="size-full" />
                </div>
              }
            />
            <Suspense
              clientOnly
              fallback={
                <div className="flex items-center justify-center h-full">
                  <Spinner size={32} />
                </div>
              }
            >
              <NotificationList />
            </Suspense>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
