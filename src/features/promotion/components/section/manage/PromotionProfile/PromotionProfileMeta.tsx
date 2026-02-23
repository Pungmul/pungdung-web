"use client";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

import type { Address } from "@/shared/types";

import {
  formatPromotionDate,
  formatPromotionTime,
  getAddressDisplayText,
} from "../../../../lib";

interface PromotionProfileMetaProps {
  variant: "horizontal" | "vertical";
  address?: Address | null | undefined;
  startAt?: string | undefined;
  onAddressClick: () => void;
}

export function PromotionProfileMeta({
  variant,
  address,
  startAt,
  onAddressClick,
}: PromotionProfileMetaProps) {
  if (variant === "horizontal") {
    return (
      <div className="w-full flex flex-col gap-[4px] items-start">
        <div
          className="flex flex-row gap-[12px] items-center font-normal max-w-full line-clamp-1 w-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onAddressClick();
          }}
        >
          <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
            장소
          </span>
          <span className="font-normal text-grey-800 text-[14px] lg:text-[18px]">
            {getAddressDisplayText(address)}
          </span>
          <ChevronRightIcon className="w-[16px] h-[16px] text-grey-500 flex-shrink-0" />
        </div>
        <div className="flex flex-row gap-[12px] items-center font-normal max-w-full line-clamp-1">
          <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
            날짜
          </span>
          <span className="font-normal text-grey-800 text-[14px] lg:text-[18px]">
            {formatPromotionDate(startAt)}
          </span>
        </div>
        <div className="flex flex-row gap-[12px] items-center font-normal max-w-full line-clamp-1">
          <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
            시간
          </span>
          <span className="font-normal text-grey-800 text-[14px] lg:text-[18px]">
            {formatPromotionTime(startAt)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-[8px]">
      <div
        className="flex flex-row gap-[4px] items-center font-normal max-w-full line-clamp-1 w-full cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onAddressClick();
        }}
      >
        <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
          {getAddressDisplayText(address)}
        </span>
        <ChevronRightIcon className="w-[12px] h-[12px] text-grey-500 flex-shrink-0" />
      </div>
      <div className="flex flex-row gap-[4px] items-center font-normal max-w-full line-clamp-1">
        <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
          {formatPromotionDate(startAt)}
        </span>
      </div>
    </div>
  );
}
