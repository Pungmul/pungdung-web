"use client";

import { useCallback, useRef, useState } from "react";

import type { RefObject } from "react";

import { useKakaoMapsEffect } from "@/shared/hooks";

import { createGPSMarker } from "../../lib";
import type { GeoCoordinates } from "../../types";

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
    if (!currentLocation) return;

    panToCenter(currentLocation);
  }, [currentLocation, panToCenter]);

  const syncCurrentLocationMarker = useCallback(() => {
    if (!isMapReady || !mapRef.current || !currentLocation) return;

    const currentLatLon = new window.kakao.maps.LatLng(
      currentLocation.latitude,
      currentLocation.longitude
    );

    if (!GPSmarkerRef.current) {
      mapRef.current.setCenter(currentLatLon);
      const { marker } = createGPSMarker({ locationPoint: currentLocation });
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
