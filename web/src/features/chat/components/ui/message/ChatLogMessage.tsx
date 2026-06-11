"use client";

import type { ReactNode } from "react";

interface ChatLogMessageProps {
  children: ReactNode;
}

export function ChatLogMessage({ children }: ChatLogMessageProps) {
  return (
    <div className="flex h-full flex-row items-end justify-center">
      <div className="flex h-full items-center rounded-md bg-grey-100 px-2 py-1 text-xs text-grey-500 lg:text-sm">
        {children}
      </div>
    </div>
  );
}
