"use client";

import { useEffect } from "react";

import type { RefObject } from "react";

type UseMapPanToCurrentLocationRefProps = {
  mapPanToCurrentRef: RefObject<(() => void) | null>;
  panToCurrentLocation: () => void;
};

export const useMapPanToCurrentLocationRef = ({
  mapPanToCurrentRef,
  panToCurrentLocation,
}: UseMapPanToCurrentLocationRefProps) => {
  useEffect(() => {
    mapPanToCurrentRef.current = panToCurrentLocation;

    return () => {
      mapPanToCurrentRef.current = null;
    };
  }, [mapPanToCurrentRef, panToCurrentLocation]);
};
