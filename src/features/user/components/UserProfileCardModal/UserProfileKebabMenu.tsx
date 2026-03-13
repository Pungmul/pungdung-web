"use client";

import React, { memo, useRef, useState } from "react";

import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

import { useClickOutside } from "@/shared/hooks";
import { Toast } from "@/shared/store";

function UserProfileKebabMenuImpl() {
  const [isOpen, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside({
    ref: containerRef,
    enabled: isOpen,
    onOutsideClick: () => setOpen(false),
  });

  const handleReport = () => {
    Toast.show({
      message: "신고 기능은 준비 중입니다.",
      type: "success",
    });
  };

  const handleBlock = () => {
    Toast.show({
      message: "차단 기능은 준비 중입니다.",
      type: "success",
    });
  };

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
              handleReport();
              setOpen(false);
            }}
          >
            신고
          </li>
          <li
            className="cursor-pointer text-right text-sm text-red-400"
            onClick={() => {
              handleBlock();
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
