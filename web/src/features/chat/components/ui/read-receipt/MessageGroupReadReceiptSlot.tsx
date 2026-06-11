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
  if (!isGroupChat || !layout.hasGroupReadReceipts) {
    return null;
  }

  return (
    <button
      type="button"
      className={cn(
        "shrink-0 border-0 bg-transparent p-0",
        layout.readReceiptAlign === "right"
          ? "self-end mr-4 cursor-pointer"
          : "self-start ml-14 cursor-pointer"
      )}
      aria-label={`읽음 ${readReceiptAvatars.length}명 보기`}
      onClick={onReadReceiptSlotClick}
    >
      <ReadReceiptAvatars
        participants={readReceiptAvatars}
        align={layout.readReceiptAlign}
        isVisible
        exposeAccessibleName={false}
      />
    </button>
  );
}
