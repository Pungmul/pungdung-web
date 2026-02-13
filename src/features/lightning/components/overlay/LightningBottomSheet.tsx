"use client";
import { useImperativeHandle, useRef, useState } from "react";

import {
  motion,
  PanInfo,
  useAnimate,
  useDragControls,
} from "framer-motion";
import type { RefObject } from "react";
import type { SwiperRef } from "swiper/react";

import { GPSOutline } from "@/shared/components/Icons";

import {
  GESTURE_THRESHOLD,
  GESTURE_VELOCITY_THRESHOLD,
  HIGH_LEVEL,
  LOW_LEVEL,
  MEDIUM_LEVEL,
} from "../../constants";
import type {
  LightningBottomSheetRefType,
  LightningMeeting,
  UserParticipationData,
} from "../../types";
import { LightningCardList } from "../section/card/LightningCardList";

type LightningBottomSheetProps = {
  bottomSheetRef: RefObject<LightningBottomSheetRefType | null>;
  swiperRef: RefObject<SwiperRef | null>;
  lightningList: LightningMeeting[];
  target: "전체" | "우리학교";
  targetOptions: readonly ("전체" | "우리학교")[];
  userPartinLightning: UserParticipationData | undefined;
  mapPanToCurrentRef: RefObject<(() => void) | null>;
  setTarget: (target: "전체" | "우리학교") => void;
};

export function setUpLevel(level: number) {
  if (level === LOW_LEVEL) {
    return MEDIUM_LEVEL;
  } else if (level === MEDIUM_LEVEL) {
    return HIGH_LEVEL;
  } else {
    return HIGH_LEVEL;
  }
}

const setDownLevel = (level: number) => {
  if (level === HIGH_LEVEL) {
    return MEDIUM_LEVEL;
  } else if (level === MEDIUM_LEVEL) {
    return LOW_LEVEL;
  } else {
    return LOW_LEVEL;
  }
};

export function LightningBottomSheet({
  bottomSheetRef,
  target,
  setTarget,
  swiperRef,
  lightningList,
  targetOptions,
  userPartinLightning,
  mapPanToCurrentRef,
}: LightningBottomSheetProps) {
  const levelChangeListener = useRef<
    ((oldLevel: number, newLevel: number) => void)[]
  >([]);
  const [container, containerAnimate] = useAnimate<HTMLDivElement>();
  const [level, setLevel] = useState(MEDIUM_LEVEL);
  const dragControls = useDragControls();

  useImperativeHandle(bottomSheetRef, () => ({
    getLevel: () => level,
    onLevelChange: (callback: (oldLevel: number, newLevel: number) => void) => {
      levelChangeListener.current.push(callback);
    },
  }));

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (
      Math.abs(info.offset.y) > GESTURE_THRESHOLD ||
      Math.abs(info.velocity.y) > GESTURE_VELOCITY_THRESHOLD
    ) {
      if (Math.abs(info.offset.y) > 300 || Math.abs(info.velocity.y) > 500) {
        const newLevel = info.offset.y > 0 ? LOW_LEVEL : HIGH_LEVEL;
        containerAnimate(
          container.current,
          { y: newLevel },
          { duration: 0.3, ease: "easeOut" }
        );
        setLevel(newLevel);

        // 레벨 변경 이벤트 발생
        levelChangeListener.current.forEach((callback) =>
          callback(level, newLevel)
        );
      } else {
        const newLevel =
          info.offset.y > 0 ? setDownLevel(level) : setUpLevel(level);
        containerAnimate(
          container.current,
          { y: newLevel },
          { duration: 0.3, ease: "easeOut" }
        );
        setLevel(newLevel);

        // 레벨 변경 이벤트 발생
        levelChangeListener.current.forEach((callback) =>
          callback(level, newLevel)
        );
      }
    } else {
      // 원위치로 돌아가기
      containerAnimate(
        container.current,
        { y: level },
        { duration: 0.3, ease: "easeOut" }
      );
    }
  };

  // 드래그 중 제한 로직
  return (
    <motion.div
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      dragDirectionLock
      dragElastic={0}
      dragConstraints={{ top: 0, bottom: 400 }}
      initial={{ y: LOW_LEVEL }}
      animate={{ y: MEDIUM_LEVEL }}
      onDragEnd={handleDragEnd}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute bottom-0 left-0 w-dvw z-10 h-fit"
      ref={container}
    >
      <div className="flex flex-row w-full justify-end items-center px-[16px] py-[8px]">
        <div
          className="flex flex-col size-[48px] rounded-full  bg-background cursor-pointer justify-center items-center shadow-lg"
          onClick={() => mapPanToCurrentRef.current?.()}
        >
          <GPSOutline className="size-[32px] text-grey-700 stroke-[2px]" />
        </div>
      </div>
      <div className="relative z-10 bottom-0 w-full rounded-tl-[12px] rounded-tr-[12px] shadow-up-md bg-background overflow-hidden flex flex-col lg:h-full lg:w-[640px] lg:py-[32px] lg:gap-[24px]">
        <div
          className="flex flex-col w-full cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="lg:hidden w-full py-[12px]">
            <div className="w-[136px] h-[4px] bg-grey-400 rounded-full mx-auto" />
          </div>
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
        </div>
        <div className="py-[8px]">
          <LightningCardList
            ref={swiperRef}
            lightningList={lightningList}
            userPartinLightning={userPartinLightning}
            callSheetUp={() => {
              containerAnimate(
                container.current,
                { y: HIGH_LEVEL },
                { duration: 0.3, ease: "easeOut" }
              );
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
