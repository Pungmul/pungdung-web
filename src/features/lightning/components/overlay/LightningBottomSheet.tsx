"use client";
import { useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

import {
  motion,
  PanInfo,
  useAnimate,
  useDragControls,
} from "framer-motion";
import type { ReactNode, RefObject } from "react";

import { GPSOutline } from "@/shared/components/Icons";

import {
  GESTURE_THRESHOLD,
  GESTURE_VELOCITY_THRESHOLD,
  HIGH_LEVEL_VISIBLE_HEIGHT,
  LOW_LEVEL_VISIBLE_HEIGHT,
  MEDIUM_LEVEL_VISIBLE_HEIGHT,
} from "../../constants";
import { getElementTranslateY } from "../../lib/get-element-translate-y";
import { resolveNearestBottomSheetLevel } from "../../lib/resolve-nearest-bottom-sheet-level";
import type { LightningBottomSheetRefType } from "../../types";
import { LightningCardList } from "../section/card/LightningCardList";

type LightningBottomSheetProps = {
  bottomSheetRef: RefObject<LightningBottomSheetRefType | null>;
  target: "전체" | "우리학교";
  targetOptions: readonly ("전체" | "우리학교")[];
  mapPanToCurrentRef: RefObject<(() => void) | null>;
  setTarget: (target: "전체" | "우리학교") => void;
  children: (controls: { expandSheet: () => void }) => ReactNode;
};

type BottomSheetLevels = {
  low: number;
  medium: number;
  high: number;
};

function createBottomSheetLevels() {
  return {
    low: LOW_LEVEL_VISIBLE_HEIGHT,
    medium: MEDIUM_LEVEL_VISIBLE_HEIGHT,
    high: HIGH_LEVEL_VISIBLE_HEIGHT,
  };
}

export function setUpLevel(level: number, levels = createBottomSheetLevels()) {
  if (level === levels.low) {
    return levels.medium;
  }

  if (level === levels.medium) {
    return levels.high;
  }

  return levels.high;
}

const setDownLevel = (level: number, levels: BottomSheetLevels) => {
  if (level === levels.high) {
    return levels.medium;
  }

  if (level === levels.medium) {
    return levels.low;
  }

  return levels.low;
};

export function LightningBottomSheet({
  bottomSheetRef,
  target,
  setTarget,
  targetOptions,
  mapPanToCurrentRef,
  children,
}: LightningBottomSheetProps) {
  const levelChangeListener = useRef<
    ((oldLevel: number, newLevel: number) => void)[]
  >([]);
  const [container, containerAnimate] = useAnimate<HTMLDivElement>();
  const sheetRef = useRef<HTMLDivElement>(null);
  const levelsRef = useRef(createBottomSheetLevels());
  const sheetHeightRef = useRef(HIGH_LEVEL_VISIBLE_HEIGHT);
  const [level, setLevel] = useState(() => levelsRef.current.medium);
  const levelRef = useRef(level);
  const dragControls = useDragControls();

  const getTranslateY = (visibleHeight: number) =>
    Math.max(sheetHeightRef.current - visibleHeight, 0);

  const snapToLevel = (
    newLevel: number,
    options: { notifyMap?: boolean; duration?: number } = {}
  ) => {
    const { notifyMap = false, duration = 0.3 } = options;
    const oldLevel = levelRef.current;

    containerAnimate(
      container.current,
      { y: getTranslateY(newLevel) },
      { duration, ease: "easeOut" }
    );
    levelRef.current = newLevel;
    setLevel(newLevel);

    if (notifyMap && oldLevel !== newLevel) {
      levelChangeListener.current.forEach((callback) =>
        callback(oldLevel, newLevel)
      );
    }
  };

  const moveToLevel = (newLevel: number) => {
    snapToLevel(newLevel, { notifyMap: true });
  };

  const reconcileLevelFromPosition = () => {
    const translateY = getElementTranslateY(container.current);
    const visibleHeight = Math.max(
      sheetHeightRef.current - translateY,
      0
    );
    const resolvedLevel = resolveNearestBottomSheetLevel(
      visibleHeight,
      levelsRef.current
    );

    if (resolvedLevel !== levelRef.current) {
      snapToLevel(resolvedLevel, { notifyMap: false, duration: 0 });
    }

    return levelRef.current;
  };

  const expandSheet = () => {
    const levels = createBottomSheetLevels();
    levelsRef.current = levels;
    moveToLevel(levels.high);
  };

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    const updateSheetHeight = () => {
      const nextSheetHeight = sheet.offsetHeight;
      sheetHeightRef.current = nextSheetHeight;
      containerAnimate(
        container.current,
        { y: Math.max(nextSheetHeight - levelRef.current, 0) },
        { duration: 0 }
      );
    };

    updateSheetHeight();

    const resizeObserver = new ResizeObserver(updateSheetHeight);
    resizeObserver.observe(sheet);
    window.addEventListener("resize", updateSheetHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateSheetHeight);
    };
  }, [container, containerAnimate]);

  useImperativeHandle(bottomSheetRef, () => ({
    getLevel: () => levelRef.current,
    reconcileLevelFromPosition,
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
      const levels = createBottomSheetLevels();
      levelsRef.current = levels;

      if (Math.abs(info.offset.y) > 300 || Math.abs(info.velocity.y) > 500) {
        const newLevel = info.offset.y > 0 ? levels.low : levels.high;
        moveToLevel(newLevel);
      } else {
        const newLevel =
          info.offset.y > 0
            ? setDownLevel(levelRef.current, levels)
            : setUpLevel(levelRef.current, levels);
        moveToLevel(newLevel);
      }
    } else {
      // 원위치로 돌아가기
      containerAnimate(
        container.current,
        { y: getTranslateY(levelRef.current) },
        { duration: 0.3, ease: "easeOut" }
      );
    }
  };

  return (
    <motion.div
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      dragDirectionLock
      dragElastic={0}
      dragConstraints={{
        top: getTranslateY(levelsRef.current.high),
        bottom: getTranslateY(levelsRef.current.low),
      }}
      initial={{ y: getTranslateY(levelsRef.current.low) }}
      animate={{ y: getTranslateY(level) }}
      onDragEnd={handleDragEnd}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute inset-x-0 bottom-0 z-10 w-dvw"
      ref={container}
    >
      <div className="absolute bottom-full left-0 flex w-full flex-row items-center justify-end px-[16px] py-[8px]">
        <div
          className="flex size-12 cursor-pointer flex-col items-center justify-center rounded-full bg-background shadow-lg"
          onClick={() => mapPanToCurrentRef.current?.()}
        >
          <span className="flex size-8 items-center justify-center">
            <GPSOutline className="size-full text-grey-700 stroke-[2px]" />
          </span>
        </div>
      </div>
      <div
        ref={sheetRef}
        className="relative z-10 bottom-0 w-full rounded-tl-[12px] rounded-tr-[12px] shadow-up-md bg-background overflow-hidden flex flex-col lg:h-full lg:w-[640px] lg:py-[32px] lg:gap-[24px]"
      >
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
