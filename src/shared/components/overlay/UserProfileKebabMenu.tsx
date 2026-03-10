"use client";

import React, { memo, useRef, useState } from "react";

import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

import { useClickOutside } from "@/shared/hooks";

type UserProfileKebabMenuProps = {
  onReport: () => void;
  onBlock: () => void;
};

function UserProfileKebabMenuImpl({
  onReport,
  onBlock,
}: UserProfileKebabMenuProps) {
  const [isOpen, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside({
    ref: containerRef,
    enabled: isOpen,
    onOutsideClick: () => setOpen(false),
  });

  return (
    <div
      ref={containerRef}
      className="relative select-none cursor-pointer"
      onClick={() => setOpen((prev) => !prev)}
    >
      <EllipsisVerticalIcon className="size-[28px] text-grey-600" />
      {isOpen && (
        <ul
          className="absolute right-0 top-full z-[60] mt-2 flex min-w-[5.5rem] flex-col gap-2 rounded-sm border border-grey-300 bg-background px-3 py-2"
          onClick={(e) => e.stopPropagation()}
        >
          <li
            className="cursor-pointer text-right text-sm text-grey-800"
            onClick={() => {
              onReport();
              setOpen(false);
            }}
          >
            신고
          </li>
          <li
            className="cursor-pointer text-right text-sm text-red-400"
            onClick={() => {
              onBlock();
              setOpen(false);
            }}
          >
            차단
          </li>
        </ul>
      )}
    </div>
  );
}

export const UserProfileKebabMenu = memo(UserProfileKebabMenuImpl);
