"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/shared/lib";
import { useView } from "@/shared/lib/view/view-store-provider";
import { toastStore } from "@/shared/store";

const TOAST_BACKGROUND = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
} as const;

const TOAST_TEXT = {
  success: "text-white",
  error: "text-white",
  warning: "text-gray-900",
  info: "text-white",
} as const;

export default function Toast() {
  const { toast, visible } = toastStore();
  const view = useView();
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById("notification-container");
    setContainer(el);
  }, []);

  if (!container) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={
            view === "desktop" ? { opacity: 0, x: 300 } : { opacity: 0, y: 300 }
          }
          animate={
            view === "desktop" ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }
          }
          exit={
            view === "desktop" ? { opacity: 0, x: 300 } : { opacity: 0, y: 300 }
          }
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: "320px",
            minWidth: "280px",
          }}
        >
          <div
            className={cn(
              "rounded-lg shadow-lg border border-gray-200 p-4",
              TOAST_BACKGROUND[toast.type] ?? TOAST_BACKGROUND.info
            )}
          >
            <div
              className={cn(
                "font-semibold text-sm text-left",
                TOAST_TEXT[toast.type] ?? TOAST_TEXT.info
              )}
            >
              {toast.message}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    container
  );
}
