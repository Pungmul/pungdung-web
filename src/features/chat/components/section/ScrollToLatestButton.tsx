"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { cn } from "@/shared";
import { FloatingButton } from "@/shared/components";

import {
  CHAT_ROOM_Z_INDEX,
  SCROLL_TO_LATEST_BUTTON_HIDE_TRANSLATE_CLASS,
} from "../../constants/ui.constants";

type ScrollToLatestButtonProps = {
  isVisible: boolean;
  bottomPx: number;
  onClick: () => void;
};

export function ScrollToLatestButton({
  isVisible,
  bottomPx,
  onClick,
}: ScrollToLatestButtonProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-4",
        "transition-transform duration-300 will-change-transform",
        isVisible ? "translate-y-0" : SCROLL_TO_LATEST_BUTTON_HIDE_TRANSLATE_CLASS
      )}
      style={{
        bottom: bottomPx,
        zIndex: CHAT_ROOM_Z_INDEX.scrollToLatestButton,
      }}
    >
      <FloatingButton
        ariaLabel="최신 메시지로 이동"
        onClick={onClick}
        innerElement={
          <ChevronDownIcon
            strokeWidth={2}
            className="size-full text-grey-500"
          />
        }
      />
    </div>
  );
}
