"use client";

import { AnimatePresence } from "framer-motion";

export default function NotificationContainer() {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-100">
      <AnimatePresence mode="sync">
        <div
          id="notification-container"
          className="fixed bottom-[96px] right-4 lg:bottom-4 flex flex-col gap-[4px] z-50"
        />
      </AnimatePresence>
    </div>
  );
} 
