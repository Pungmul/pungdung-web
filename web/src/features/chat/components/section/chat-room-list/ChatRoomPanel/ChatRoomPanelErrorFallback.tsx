"use client";

import type { ErrorBoundaryFallbackProps } from "@suspensive/react";

import { Responsive } from "@/shared/components";
import { ChatIconOutline } from "@/shared/components/Icons";

export function ChatRoomPanelErrorFallback({
  reset,
}: ErrorBoundaryFallbackProps) {
  return (
    <Responsive
      mobile={
        <div className="flex h-full w-full flex-col items-center justify-center px-6">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <span className="flex size-16 items-center justify-center p-2">
              <ChatIconOutline className="size-full" />
            </span>
            <div className="whitespace-pre-line text-[15px] text-grey-600">
              {"오류가 발생했어요.\n다시 시도해주세요."}
            </div>
            <button
              type="button"
              className="h-[40px] rounded-[8px] bg-primary px-4 text-[14px] font-semibold text-background"
              onClick={reset}
            >
              다시 시도
            </button>
          </div>
        </div>
      }
      desktop={
        <div className="flex h-full w-full flex-col items-center justify-center px-6">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <div className="whitespace-pre-line text-[15px] text-grey-600">
              {"오류가 발생했어요.\n다시 시도해주세요."}
            </div>
            <button
              type="button"
              className="h-[40px] rounded-[8px] bg-primary px-4 text-[14px] font-semibold text-background"
              onClick={reset}
            >
              다시 시도
            </button>
          </div>
        </div>
      }
    />
  );
}
