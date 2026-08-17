"use client";

import React from "react";

import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";

import type { PendingMessage } from "../../../types";

interface MessagePendingSideProps {
  variant: "text" | "image";
  message: PendingMessage;
  onRetryFailedText: (failed: PendingMessage) => void;
  onRetryFailedImage: (failed: PendingMessage) => void;
  onDeletePending: (message: PendingMessage) => void;
}

export function MessagePendingSide({
  variant,
  message,
  onRetryFailedText,
  onRetryFailedImage,
  onDeletePending,
}: MessagePendingSideProps) {
  if (variant === "text") {
    if (message.state === "pending") {
      return <div className="text-grey-300 text-[11px] lg:text-[12px]">전송중</div>;
    }

    return (
      <div className="flex flex-row gap-2">
        <button
          type="button"
          aria-label="메시지 다시 보내기"
          className="flex size-4 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
          onClick={() => {
            onRetryFailedText(message);
          }}
        >
          <PaperAirplaneIcon className="size-full text-[#ff6767]" />
        </button>
        <button
          type="button"
          aria-label="메시지 삭제"
          className="flex size-4 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
          onClick={() => {
            onDeletePending(message);
          }}
        >
          <XMarkIcon className="size-full text-[#ff6767]" />
        </button>
      </div>
    );
  }

  if (message.state === "pending") {
    return (
      <div className="flex flex-row gap-2">
        <span className="flex size-4 items-center justify-center">
          <PaperAirplaneIcon className="size-full text-[#ff6767]" />
        </span>
        <div className="text-grey-300 text-[11px] lg:text-[12px]">전송중</div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2">
      <button
        type="button"
        aria-label="이미지 다시 보내기"
        className="flex size-4 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        onClick={() => {
          void onRetryFailedImage(message);
        }}
      >
        <PaperAirplaneIcon className="size-full text-[#ff6767]" />
      </button>
      <button
        type="button"
        aria-label="메시지 삭제"
        className="flex size-4 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        onClick={() => {
          onDeletePending(message);
        }}
      >
        <XMarkIcon className="size-full text-[#ff6767]" />
      </button>
    </div>
  );
}
