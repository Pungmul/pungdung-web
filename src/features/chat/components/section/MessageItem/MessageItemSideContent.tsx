"use client";

import React from "react";

import type { MessageItemLayoutContext } from "./MessageItem.types";
import { DirectReadLabel } from "../../ui/DirectReadLabel";

interface MessageItemSideContentProps {
  layout: MessageItemLayoutContext;
  showDirectReadLabel: boolean;
  messageCreatedAt: string;
}

export function MessageItemSideContent({
  layout,
  showDirectReadLabel,
  messageCreatedAt,
}: MessageItemSideContentProps) {
  if (!layout.hasSideContent) {
    return null;
  }

  return (
    <div
      className={
        "flex flex-col gap-[2px] shrink-0 min-w-fit" +
        (layout.isUser ? " self-start" : " self-end")
      }
    >
      {layout.showDirectReadSlot ? (
        <DirectReadLabel visible={showDirectReadLabel} />
      ) : null}
      {layout.showTimestamp && messageCreatedAt ? (
        <div className="text-grey-400 text-[10px] lg:text-[11px] leading-4">
          {layout.timeStamp}
        </div>
      ) : null}
    </div>
  );
}
