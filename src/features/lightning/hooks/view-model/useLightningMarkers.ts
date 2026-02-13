"use client";

import { useCallback, useRef } from "react";

import { useKakaoMapsEffect } from "@/shared/hooks";

import { createLightningCircle } from "../../lib";
import type { LightningMeeting } from "../../types";

interface UseLightningMarkersProps {
  mapRef: React.RefObject<kakao.maps.Map | null>;
  lightningList: LightningMeeting[];
  onMarkerClick: (lightningId: number) => void;
}

/**
 * 번개 목록을 카카오 지도 마커 레이어로 반영한다.
 */
export const useLightningMarkers = ({
  mapRef,
  lightningList,
  onMarkerClick,
}: UseLightningMarkersProps) => {
  const markersRef = useRef<
    { marker: kakao.maps.Marker; circle: kakao.maps.Circle }[]
  >([]);

  const clearLightningMarkers = useCallback(() => {
    markersRef.current.forEach(({ marker, circle }) => {
      circle.setMap(null);
      marker.setMap(null);
    });

    markersRef.current = [];
  }, []);

  const syncLightningMarkers = useCallback(() => {
    clearLightningMarkers();

    if (lightningList.length === 0) return;
    if (mapRef.current) {
      lightningList.forEach(({ id, latitude, longitude }) => {
        const { marker, circle } = createLightningCircle({
          locationPoint: {
            latitude,
            longitude,
          },
          onClick: () => onMarkerClick(id),
        });
        markersRef.current.push({ marker, circle });

        marker.setMap(mapRef.current);
        circle.setMap(mapRef.current);
      });
    }

    return clearLightningMarkers;
  }, [clearLightningMarkers, lightningList, mapRef, onMarkerClick]);

  useKakaoMapsEffect(syncLightningMarkers);
};
