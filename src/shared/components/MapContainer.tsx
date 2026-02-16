"use client";

import { useCallback, useRef } from "react";

import { LocationType } from "@/features/location";

import { useKakaoMapsEffect } from "../hooks/useKakaoMaps";

/**
 * 기본 위치는 서울 시청 좌표입니다.
 */
const DEFAULT_LOCATION: LocationType = {
  latitude: 37.566826,
  longitude: 126.9786567,
};

export default function MapContainer({
  mapRef,
  initialLocation = DEFAULT_LOCATION,
  children,
  className,
  additionalOptions,
  setIsMapReady,
}: {
  mapRef: React.RefObject<kakao.maps.Map | null>;
  initialLocation?: LocationType | null;
  children?: React.ReactNode;
  className?: string;
  additionalOptions?: Partial<kakao.maps.MapOptions>;
  setIsMapReady?: (ready: boolean) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const initializeMap = useCallback(() => {
    const container = mapContainerRef.current;
    if (!container) {
      console.error("Map container not found");
      return;
    }

    const location = initialLocation ?? DEFAULT_LOCATION;

    const options = {
      center: new window.kakao.maps.LatLng(
        location.latitude,
        location.longitude
      ),
      level: 4,
      ...additionalOptions,
    };

    const mapInstance = new window.kakao.maps.Map(container, options);

    mapRef.current = mapInstance;
    setIsMapReady?.(true);
  }, [additionalOptions, initialLocation, mapRef, setIsMapReady]);

  // 지도 초기화 (SDK 로드 완료 후)
  useKakaoMapsEffect(initializeMap);

  return (
    <div ref={mapContainerRef} className={className}>
      {children}
    </div>
  );
}
