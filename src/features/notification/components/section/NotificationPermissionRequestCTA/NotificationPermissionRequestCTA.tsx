"use client";

import { useCallback, useState } from "react";

import { BellIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/shared/components";

import { useNotificationToggleAction } from "../../../hooks/actions";
import { supportsNotification } from "../../../lib";
import { notificationPermissionStore } from "../../../store/notification-permission.store";

export default function NotificationPermissionRequestCTA() {
  const [open, setOpen] = useState(true);
  const permission = notificationPermissionStore((state) => state.permission);
  const toggleNotification = useNotificationToggleAction();

  const handleEnableNotification = useCallback(async () => {
    await toggleNotification(true);
  }, [toggleNotification]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  if (!supportsNotification()) return null;
  if (permission === "granted") return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 bottom-20 md:bottom-4 md:left-[100px] lg:left-[224px] z-50 flex justify-center px-4 min-w-80"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 100 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 15 || info.velocity.y > 250) {
              handleClose();
            }
          }}
        >
          <motion.div
            layout
            className="w-full px-3 py-4 bg-grey-800 bg-opacity-90 rounded-lg shadow-lg flex flex-row justify-between items-center gap-4"
          >
            <div className="flex flex-col gap-3 text-grey-100">
              <span className="font-medium text-sm inline-flex items-center gap-1">
                <div className="size-5 p-0.5 inline-block">
                  <BellIcon className="text-grey-100 text-opacity-80" />
                </div>
                알림 설정
              </span>
              <span className="text-grey-100 text-opacity-80 text-[12px] p-1">
                원활한 사용을 위해 알림을 받으시겠어요?
              </span>
            </div>
            <Button
              onClick={handleEnableNotification}
              className="w-auto h-fit px-2 py-2 text-xs shrink-0"
            >
              알림 받기
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
