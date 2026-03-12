"use client";

import { memo, useRef, useState } from "react";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

import { cn } from "@/shared";
import { useClickOutside } from "@/shared/hooks";

type FriendMenuItem = {
  label: string;
  handler: () => void;
  className?: string;
};

type FriendMenuProps = {
  items: FriendMenuItem[];
};

function FriendMenuImpl({ items }: FriendMenuProps) {
  const [isOpen, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside({
    ref: containerRef,
    enabled: isOpen,
    onOutsideClick: () => setOpen(false),
  });

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        className="flex cursor-pointer items-center justify-center rounded p-0.5 text-grey-600 hover:bg-grey-100"
        aria-label="친구 메뉴"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <EllipsisHorizontalIcon className="size-5 shrink-0" aria-hidden />
      </button>
      {isOpen && (
        <ul
          className="absolute right-0 top-full z-20 mt-1 flex min-w-[6.5rem] flex-col gap-2 rounded-sm border border-grey-300 bg-background px-3 py-2 shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item) => (
            <li
              key={item.label}
              className={cn("cursor-pointer text-right text-sm text-grey-800", item.className)}
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

export const FriendMenu = memo(FriendMenuImpl);
