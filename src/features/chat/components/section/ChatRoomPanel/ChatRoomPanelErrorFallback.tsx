"use client";

import type { ErrorBoundaryFallbackProps } from "@suspensive/react";

import { Responsive } from "@/shared/components";
import { ChatIconOutline } from "@/shared/components/Icons";

type ChatRoomPanelErrorFallbackProps = ErrorBoundaryFallbackProps & {
  onRetry: () => void;
};

export function ChatRoomPanelErrorFallback({
  onRetry,
}: ChatRoomPanelErrorFallbackProps) {
  return (
    <Responsive
      mobile={
        <div className="flex flex-col h-full w-full justify-center items-center px-6">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <span className="size-16 p-2 flex items-center justify-center">
              <ChatIconOutline className="size-full" />
            </span>
            <div className="text-[15px] text-grey-600 whitespace-pre-line">
              {"오류가 발생했어요.\n다시 시도해주세요."}
            </div>
            <button
              type="button"
              className="h-[40px] px-4 rounded-[8px] bg-primary text-background text-[14px] font-semibold"
              onClick={onRetry}
            >
              다시 시도
            </button>
          </div>
        </div>
      }
      desktop={
        <div className="flex flex-col h-full w-full justify-center items-center px-6">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <div className="text-[15px] text-grey-600 whitespace-pre-line">
              {"오류가 발생했어요.\n다시 시도해주세요."}
            </div>
            <button
              type="button"
              className="h-[40px] px-4 rounded-[8px] bg-primary text-background text-[14px] font-semibold"
              onClick={onRetry}
            >
              다시 시도
            </button>
          </div>
        </div>
      }
    />
  );
}
