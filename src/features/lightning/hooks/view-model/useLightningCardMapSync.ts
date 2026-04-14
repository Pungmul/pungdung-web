"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import type { RefObject } from "react";
import type { SwiperRef } from "swiper/react";
import type { Swiper } from "swiper/types";

import {
  createLightningLookup,
  getLightningIdAtIndex,
  resolveLightningMapTargetById,
} from "../../services";
import type {
  GeoCoordinates,
  LightningBottomSheetRefType,
  LightningMeeting,
} from "../../types";

type UseLightningCardMapSyncProps = {
  bottomSheetRef: RefObject<LightningBottomSheetRefType | null>;
  swiperRef: RefObject<SwiperRef | null>;
  lightningList: LightningMeeting[];
  panToCenter: (location: GeoCoordinates) => void;
  enabled: boolean;
};

export const useLightningCardMapSync = ({
  bottomSheetRef,
  swiperRef,
  lightningList,
  panToCenter,
  enabled,
}: UseLightningCardMapSyncProps) => {
  const activeLightningIdRef = useRef<number | null>(null);
  const lightningLookup = useMemo(
    () => createLightningLookup(lightningList),
    [lightningList]
  );

  const panToLightningForCurrentLevel = useCallback(
    (location: GeoCoordinates) => {
      bottomSheetRef.current?.reconcileLevelFromPosition();
      panToCenter(location);
    },
    [bottomSheetRef, panToCenter]
  );

  const moveToLightningId = useCallback(
    (lightningId: number, speed?: number) => {
      const target = resolveLightningMapTargetById(
        lightningLookup,
        lightningId
      );

      if (!target) return;

      activeLightningIdRef.current = target.id;

      const swiper = swiperRef.current?.swiper;

      if (swiper && swiper.activeIndex !== target.index) {
        swiper.slideTo(target.index, speed);
        return;
      }

      panToLightningForCurrentLevel(target.location);
    },
    [lightningLookup, panToLightningForCurrentLevel, swiperRef]
  );

  const moveToLightningIndex = useCallback(
    (requestedIndex: number, speed?: number) => {
      const lightningId = getLightningIdAtIndex(lightningList, requestedIndex);

      if (lightningId === null) return;

      moveToLightningId(lightningId, speed);
    },
    [lightningList, moveToLightningId]
  );

  useEffect(() => {
    if (!enabled) return;

    if (activeLightningIdRef.current !== null) {
      const target = resolveLightningMapTargetById(
        lightningLookup,
        activeLightningIdRef.current
      );

      if (target) {
        moveToLightningId(activeLightningIdRef.current, 0);
        return;
      }
    }

    moveToLightningIndex(swiperRef.current?.swiper.activeIndex ?? 0, 0);
  }, [
    enabled,
    lightningLookup,
    moveToLightningId,
    moveToLightningIndex,
    swiperRef,
  ]);

  useEffect(() => {
    if (!enabled) return;

    const swiper = swiperRef.current?.swiper;
    if (!swiper || lightningList.length === 0) return;

    const handleSlideChangeTransitionEnd = (swiperInstance: Swiper) => {
      moveToLightningIndex(swiperInstance.activeIndex);
    };

    swiper.on("slideChangeTransitionEnd", handleSlideChangeTransitionEnd);

    return () => {
      swiper.off("slideChangeTransitionEnd", handleSlideChangeTransitionEnd);
    };
  }, [enabled, lightningList.length, moveToLightningIndex, swiperRef]);

  return {
    moveToLightningId,
    moveToLightningIndex,
  };
};
