"use client";

import React from "react";

import { cn } from "@/shared";

import { ReadReceiptAvatars } from "./ReadReceiptAvatars";
import type { MessageItemLayoutContext } from "../../../lib/message/message-item-layout.types";
import type { ReadReceiptAvatar } from "../../../types/read-receipt.types";

interface MessageGroupReadReceiptSlotProps {
  isGroupChat: boolean;
  layout: MessageItemLayoutContext;
  readReceiptAvatars: readonly ReadReceiptAvatar[];
  onReadReceiptSlotClick: (() => void) | undefined;
}

export function MessageGroupReadReceiptSlot({
  isGroupChat,
  layout,
  readReceiptAvatars,
  onReadReceiptSlotClick,
}: MessageGroupReadReceiptSlotProps) {
  if (!isGroupChat) {
    return null;
  }

  return (
    <button
      type="button"
      className={cn(
        "absolute -bottom-4 z-10 border-0 bg-transparent p-0",
        layout.readReceiptAlign === "right" ? "right-4" : "left-14",
        layout.hasGroupReadReceipts
          ? "cursor-pointer opacity-100"
          : "pointer-events-none cursor-default opacity-0"
      )}
      aria-hidden={!layout.hasGroupReadReceipts}
      aria-label={
        layout.hasGroupReadReceipts
          ? `읽음 ${readReceiptAvatars.length}명 보기`
          : undefined
      }
      onClick={layout.hasGroupReadReceipts ? onReadReceiptSlotClick : undefined}
    >
      <ReadReceiptAvatars
        participants={readReceiptAvatars}
        align={layout.readReceiptAlign}
        isVisible={layout.hasGroupReadReceipts}
      />
    </button>
  );
}
