"use client";

import { type ReactNode } from "react";

import { cn } from "@/shared/lib";

interface SummaryTokenProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  truncate?: boolean;
  className?: string;
}

export function SummaryToken({
  children,
  onClick,
  icon,
  truncate = false,
  className,
}: SummaryTokenProps) {
  return (
    <span
      className={cn(
        "text-base text-grey-700 flex items-center gap-1 px-2 py-1 bg-grey-200 w-fit rounded-md font-bold",
        onClick && "cursor-pointer",
        truncate && "truncate",
        className
      )}
      onClick={onClick}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {truncate ? (
        <span className="truncate max-w-[280px] max-[360px]:max-w-[240px] max-[320px]:max-w-[210px]">
          {children}
        </span>
      ) : (
        children
      )}
    </span>
  );
}
