"use client";

import type { RefObject } from "react";
import type { SwiperRef } from "swiper/react";

import { Space } from "@/shared";

import type { LightningMeeting, UserParticipationData } from "../../types";
import { LightningCardList } from "../section/card/LightningCardList";

type LightningSidebarProps = {
  swiperRef: RefObject<SwiperRef | null>;
  target: "전체" | "우리학교";
  targetOptions: readonly ("전체" | "우리학교")[];
  lightningList: LightningMeeting[];
  userPartinLightning: UserParticipationData | undefined;
  setTarget: (target: "전체" | "우리학교") => void;
};

export function LightningSidebar({
  target,
  setTarget,
  swiperRef,
  lightningList,
  targetOptions,
  userPartinLightning,
}: LightningSidebarProps) {
  return (
    <div className="relative z-10 rounded-tr-xl rounded-br-xl shadow-up-md bg-background overflow-hidden flex flex-col h-full w-[640px]">
      <Space h={36} />
      <div className="px-[24px] py-[8px] text-lg font-semibold">
        내 주변에 발생한 <span className="text-secondary">번개</span>
      </div>

      <div className="flex flex-row gap-2 px-[24px] py-[8px]">
        {targetOptions.map((item) => (
          <div
            key={"target-option-" + item}
            className={
              "text-sm border border-grey-700 rounded-lg px-2 py-2 cursor-pointer " +
              (target === item
                ? "text-background bg-grey-700"
                : "text-grey-700")
            }
            onClick={() => setTarget(item)}
          >
            {item}
          </div>
        ))}
      </div>

      <Space h={24} />
      <LightningCardList
        ref={swiperRef}
        lightningList={lightningList}
        userPartinLightning={userPartinLightning}
      />
    </div>
  );
}
