"use client";

import { useRef } from "react";

import type { SwiperRef } from "swiper/react";

import type { LightningBottomSheetRefType } from "../../types";

/**
 * 바텀시트·스와이퍼 ref만 보관한다.
 * 바텀시트 단(level) 변화에 따른 지도 `panBy`는 `useLightningMapBottomSheetSync`가
 * 지도 준비 이후 한 번 연결한다.
 */
export const useLightningBottomSheetState = () => {
  const bottomSheetRef = useRef<LightningBottomSheetRefType>(null);
  const swiperRef = useRef<SwiperRef | null>(null);

  return {
    bottomSheetRef,
    swiperRef,
  };
};
