"use client";

import { useCallback, useRef, useState } from "react";

import type { RefObject } from "react";

import { useKakaoMapsEffect } from "@/shared/hooks";

import { createGPSMarker } from "../../lib";
import type { GeoCoordinates } from "../../types";

import { MAP_LOCATION_FALLBACK } from "@/features/location";
import { locationStore } from "@/features/location/store";

type UseLightningCurrentLocationOnMapProps = {
  mapRef: RefObject<kakao.maps.Map | null>;
  isMapReady: boolean;
  panToCenter: (location: GeoCoordinates) => void;
};

export const useLightningCurrentLocationOnMap = ({
  mapRef,
  isMapReady,
  panToCenter,
}: UseLightningCurrentLocationOnMapProps) => {
  const currentLocation = locationStore((state) => state.currentLocation);

  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const GPSmarkerRef = useRef<kakao.maps.Marker | null>(null);

  const panToCurrentLocation = useCallback(() => {
    const location = currentLocation ?? MAP_LOCATION_FALLBACK;
    panToCenter(location);
  }, [currentLocation, panToCenter]);

  const syncCurrentLocationMarker = useCallback(() => {
    if (!isMapReady || !mapRef.current) return;

    const locationPoint = currentLocation ?? MAP_LOCATION_FALLBACK;

    const currentLatLon = new window.kakao.maps.LatLng(
      locationPoint.latitude,
      locationPoint.longitude
    );

    // 폴백 좌표만 쓸 때는 ‘내 위치’ 마커를 두지 않고 지도 중심만 맞춘다.
    if (currentLocation == null) {
      mapRef.current.setCenter(currentLatLon);
      GPSmarkerRef.current?.setMap(null);
      setIsLocationLoaded(true);

      return () => {
        GPSmarkerRef.current?.setMap(null);
      };
    }

    if (!GPSmarkerRef.current) {
      mapRef.current.setCenter(currentLatLon);
      const { marker } = createGPSMarker({ locationPoint });
      GPSmarkerRef.current = marker;
    } else {
      GPSmarkerRef.current.setPosition(currentLatLon);
    }

    GPSmarkerRef.current.setMap(mapRef.current);
    setIsLocationLoaded(true);

    return () => {
      GPSmarkerRef.current?.setMap(null);
    };
  }, [currentLocation, isMapReady, mapRef]);

  useKakaoMapsEffect(syncCurrentLocationMarker);

  return {
    currentLocation,
    isLocationLoaded,
    panToCurrentLocation,
  };
};
