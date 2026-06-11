"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/shared/lib";
import { useView } from "@/shared/lib/view/view-store-provider";
import { toastStore } from "@/shared/store";
import { ToastType } from "@/shared/types/toast";

const TOAST_MOTION = {
  enterY: 12,
  exitY: 16,
  transition: { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.8 },
  exitOpacityDuration: 0.2,
};

const TOAST_STYLE = {
  success: {
    Icon: CheckCircleIcon,
    icon: "text-green",
  },
  error: {
    Icon: ExclamationCircleIcon,
    icon: "text-warning",
  },
  warning: {
    Icon: ExclamationTriangleIcon,
    icon: "text-secondary",
  },
  info: {
    Icon: InformationCircleIcon,
    icon: "text-[var(--color-correct)]",
  },
} as const satisfies Record<
  ToastType,
  {
    Icon: typeof CheckCircleIcon;
    icon: string;
  }
>;

interface ToastProps {
  containerId: string;
}

export default function Toast({ containerId }: ToastProps) {
  const view = useView();
  const toasts = toastStore((state) => state.toasts);
  const hideToast = toastStore((state) => state.hide);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const isDesktop = view === "desktop";
  const motionEnterY = isDesktop ? -TOAST_MOTION.enterY : TOAST_MOTION.enterY;
  const motionExitY = isDesktop ? -TOAST_MOTION.exitY : TOAST_MOTION.exitY;

  useEffect(() => {
    const el = document.getElementById(containerId);
    setContainer(el);
  }, [containerId]);

  if (!container) return null;

  return createPortal(
    <AnimatePresence mode="sync">
      {toasts.map((toast) => {
        const { Icon, icon } = TOAST_STYLE[toast.type];

        return (
          <motion.div
            key={toast.id}
            layout="position"
            initial={{ y: motionEnterY }}
            animate={{ y: 0 }}
            exit={{ y: motionExitY, opacity: 0 }}
            transition={{
              ...TOAST_MOTION.transition,
              opacity: {
                duration: TOAST_MOTION.exitOpacityDuration,
                ease: "easeOut",
              },
            }}
            className="w-full min-w-[280px] max-w-[320px]"
          >
            <div className="relative rounded-lg bg-toast px-4 py-3 pr-10 shadow-lg">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center",
                    icon
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="whitespace-pre-line text-left text-sm font-medium leading-relaxed text-toast-foreground">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                aria-label="토스트 닫기"
                onClick={() => hideToast(toast.id)}
                className="absolute right-3 top-3 rounded-full p-1 text-toast-foreground/55 transition-colors hover:bg-toast-foreground/10 hover:text-toast-foreground"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>,
    container
  );
}
