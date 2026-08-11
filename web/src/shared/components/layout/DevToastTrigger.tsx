"use client";

import { useRef, useState } from "react";

import {
  DEV_TOAST_LABEL,
  DEV_TOAST_TYPES,
} from "@/shared/constants/toast-dev-tool.constant";
import { useClickOutside } from "@/shared/hooks";
import { cn } from "@/shared/lib";
import { Toast } from "@/shared/store";
import type { ToastType } from "@/shared/types/toast";

import { FloatingButton } from "../ui/FloatingButton";

// 모바일 탭 4rem + 트리거 여백 1.5rem
const DEV_TOAST_TRIGGER_MOBILE_BOTTOM_CLASS =
  "max-md:bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))]";

function showDevToast(type: ToastType) {
  const label = DEV_TOAST_LABEL[type];
  const message = window.prompt(
    "표시할 토스트 메시지",
    `개발 토스트 (${label})`,
  );

  if (message === null) {
    return;
  }

  const trimmed = message.trim();
  if (trimmed === "") {
    return;
  }

  Toast.show({
    message: trimmed,
    type,
  });
}

export function DevToastTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: containerRef,
    enabled: isOpen,
    onOutsideClick: () => setIsOpen(false),
  });

  if (!isDevToastTriggerEnabled()) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none fixed z-50 left-4 flex flex-col items-start gap-2 md:bottom-4",
        DEV_TOAST_TRIGGER_MOBILE_BOTTOM_CLASS,
      )}
    >
      {isOpen ? (
        <div className="pointer-events-auto flex min-w-24 flex-col overflow-hidden rounded-md border border-grey-300 bg-background shadow-sm">
          {DEV_TOAST_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className="px-3 py-2 text-left text-xs text-grey-800 hover:bg-grey-100"
              onClick={() => {
                setIsOpen(false);
                window.setTimeout(() => {
                  showDevToast(type);
                }, DEV_TOAST_PROMPT_DELAY_MS);
              }}
            >
              {DEV_TOAST_LABEL[type]}
            </button>
          ))}
        </div>
      ) : null}
      <FloatingButton
        ariaLabel="개발용 토스트 표시"
        className="w-auto min-w-9 px-2 bg-blue-300"
        innerElement={
          <span className="text-[10px] font-semibold text-white">토스트</span>
        }
        onClick={() => setIsOpen((open) => !open)}
      />
    </div>
  );
}

const DEV_TOAST_PROMPT_DELAY_MS = 0;

function isDevToastTriggerEnabled() {
  const value = process.env.NEXT_PUBLIC_DEV_TOAST;
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}
