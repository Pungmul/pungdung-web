import React from "react";

import { cn } from "@/shared";

interface ListEmptyViewProps {
  message: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * 리스트 empty case 공통 레이아웃.
 * ListEmptyComponent로 넘길 때 message와 optional action(예: LinkChipButton)을 사용.
 */
export function ListEmptyView({
  message,
  action,
  className = "",
}: ListEmptyViewProps) {
  return (
    <div
      className={cn(
        "flex flex-1 min-h-0 w-full flex-col items-center justify-center gap-4 px-6 py-12",
        className
      )}
    >
      <p className="text-grey-500 text-[14px] lg:text-[16px] text-center">
        {message}
      </p>
      {action}
    </div>
  );
}
