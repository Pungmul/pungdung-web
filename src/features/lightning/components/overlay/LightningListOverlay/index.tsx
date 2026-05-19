"use client";

import { useQuery } from "@tanstack/react-query";

import type { RefObject } from "react";
import type { SwiperRef } from "swiper/react";

import { myPageQueries } from "@/features/my-page";

import { Responsive } from "@/shared";

import { LightningBottomSheet } from "./LightningBottomSheet";
import { LightningSidebar } from "./LightningSidebar";
import type {
  LightningBottomSheetRefType,
  LightningMeeting,
} from "../../../types";
import { LightningCardList } from "../../section/card/LightningCardList";

type LightningListOverlayProps = {
  bottomSheetRef: RefObject<LightningBottomSheetRefType | null>;
  swiperRef: RefObject<SwiperRef | null>;
  lightningList: LightningMeeting[];
  target: "전체" | "우리학교";
  mapPanToCurrentRef: RefObject<(() => void) | null>;
  mapMoveToLightningIndexRef: RefObject<
    ((index: number, speed?: number) => void) | null
  >;
  setTarget: (target: "전체" | "우리학교") => void;
};

/**
 * 모바일 바텀시트·데스크톱 사이드바는 동일한 목록/필터를 쓴다.
 * `Responsive`로 인해 한쪽이 언마운트돼도, 데이터 훅은 이 컴포넌트에 두어
 * 뷰 전환 시 쿼리 구독·캐시 사용이 끊기지 않게 한다.
 */
export function LightningListOverlay({
  bottomSheetRef,
  swiperRef,
  target,
  lightningList,
  mapPanToCurrentRef,
  mapMoveToLightningIndexRef,
  setTarget,
}: LightningListOverlayProps) {
  const handleSelectLightningAtIndex = (index: number) => {
    mapMoveToLightningIndexRef.current?.(index);
  };
  const { data: myInfo } = useQuery(myPageQueries.info());
  const targetOptions =
    myInfo?.groupName !== null
      ? (["전체", "우리학교"] as const)
      : (["전체"] as const);

  const listProps = {
    target,
    setTarget,
    targetOptions,
  };

  return (
    <Responsive
      mobile={
        <LightningBottomSheet
          {...listProps}
          bottomSheetRef={bottomSheetRef}
          mapPanToCurrentRef={mapPanToCurrentRef}
        >
          {({ expandSheet }) => (
            <LightningCardList
              ref={swiperRef}
              lightningList={lightningList}
              callSheetUp={expandSheet}
              onSelectLightningAtIndex={handleSelectLightningAtIndex}
            />
          )}
        </LightningBottomSheet>
      }
      desktop={
        <LightningSidebar {...listProps}>
          <LightningCardList
            ref={swiperRef}
            lightningList={lightningList}
            onSelectLightningAtIndex={handleSelectLightningAtIndex}
          />
        </LightningSidebar>
      }
    />
  );
}
