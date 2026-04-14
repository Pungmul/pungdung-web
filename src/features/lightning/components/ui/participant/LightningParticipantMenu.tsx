"use client";

import { memo, useRef, useState } from "react";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

import { cn } from "@/shared";
import { useAnchorDropdownPlacement, useClickOutside } from "@/shared/hooks";

type LightningParticipantMenuItem = {
  label: string;
  handler: () => void;
  className?: string;
};

type LightningParticipantMenuProps = {
  items: LightningParticipantMenuItem[];
};

function LightningParticipantMenuImpl({ items }: LightningParticipantMenuProps) {
  const [isOpen, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  const { openUpward } = useAnchorDropdownPlacement({
    anchorRef: containerRef,
    enabled: isOpen,
    onAnchorOutsideViewport: close,
  });

  useClickOutside({
    ref: containerRef,
    enabled: isOpen,
    onOutsideClick: close,
  });

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        className="flex cursor-pointer items-center justify-center rounded p-0.5 text-grey-600 hover:bg-grey-100"
        aria-label="참여자 메뉴"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <span className="flex size-5 shrink-0 items-center justify-center">
          <EllipsisHorizontalIcon className="size-full" aria-hidden />
        </span>
      </button>
      {isOpen && (
        <ul
          className={cn(
            "absolute right-0 z-20 flex min-w-[6.5rem] flex-col gap-2 rounded-sm border border-grey-300 bg-background px-3 py-2 shadow-sm",
            openUpward ? "bottom-full mb-1" : "top-full mt-1"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item) => (
            <li
              key={item.label}
              className={cn(
                "cursor-pointer text-right text-sm text-grey-800",
                item.className
              )}
              onClick={() => {
                item.handler();
                setOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const LightningParticipantMenu = memo(LightningParticipantMenuImpl);
