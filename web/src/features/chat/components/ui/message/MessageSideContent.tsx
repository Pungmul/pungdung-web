"use client";

import React from "react";

import type { MessageItemLayoutContext } from "../../../lib/message/message-item-layout.types";
import { DirectReadLabel } from "../read-receipt/DirectReadLabel";

interface MessageSideContentProps {
  layout: MessageItemLayoutContext;
  showDirectReadLabel: boolean;
  messageCreatedAt: string;
}

export function MessageSideContent({
  layout,
  showDirectReadLabel,
  messageCreatedAt,
}: MessageSideContentProps) {
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
