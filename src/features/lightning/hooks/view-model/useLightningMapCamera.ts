"use client";

import { useCallback, useRef } from "react";

import type { RefObject } from "react";

import { getAdjustedCenter } from "../../lib";
import type { GeoCoordinates, LightningBottomSheetRefType } from "../../types";

type UseLightningMapCameraProps = {
  bottomSheetRef: RefObject<LightningBottomSheetRefType | null>;
};

export const useLightningMapCamera = ({
  bottomSheetRef,
}: UseLightningMapCameraProps) => {
  const mapRef = useRef<kakao.maps.Map | null>(null);

  const panToCenter = useCallback(
    ({ latitude, longitude }: GeoCoordinates) => {
      if (!mapRef.current) return;

      const targetLatLon = new window.kakao.maps.LatLng(latitude, longitude);

      if (!bottomSheetRef.current) {
        mapRef.current.panTo(targetLatLon);
        return;
      }

      mapRef.current.panTo(
        getAdjustedCenter(mapRef.current, targetLatLon, bottomSheetRef.current)
      );
    },
    [bottomSheetRef]
  );

  return {
    mapRef,
    panToCenter,
  };
};
