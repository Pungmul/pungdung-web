"use client";

import { useCallback, useRef } from "react";

import type { RefObject } from "react";

import { useKakaoMapsEffect } from "@/shared/hooks";

import type { LightningBottomSheetRefType } from "../../types";

type UseLightningMapBottomSheetSyncProps = {
  bottomSheetRef: RefObject<LightningBottomSheetRefType | null>;
  mapRef: RefObject<kakao.maps.Map | null>;
  isMapReady: boolean;
};

export const useLightningMapBottomSheetSync = ({
  bottomSheetRef,
  mapRef,
  isMapReady,
}: UseLightningMapBottomSheetSyncProps) => {
  const syncedMapRef = useRef<kakao.maps.Map | null>(null);

  const syncBottomSheetLevelToMap = useCallback(() => {
    if (!isMapReady || !mapRef.current || !bottomSheetRef.current) return;
    if (syncedMapRef.current === mapRef.current) return;

    const map = mapRef.current;

    bottomSheetRef.current.onLevelChange((oldLevel, newLevel) => {
      map.panBy(0, (oldLevel - newLevel) / 2);
    });

    syncedMapRef.current = map;
  }, [bottomSheetRef, isMapReady, mapRef]);

  useKakaoMapsEffect(syncBottomSheetLevelToMap);
};
