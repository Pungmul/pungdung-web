"use client";

import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { locationStore } from "@/features/location";

import { useUpdateUserLocation } from "./useUpdateUserLocation";
import { lightningQueries } from "../../queries";

export const useSyncUserLocation = () => {
  const currentLocation = locationStore((state) => state.currentLocation);
  const setCurrentLocation = locationStore((state) => state.setCurrentLocation);
  const getCurrentPosition = locationStore((state) => state.getCurrentPosition);

  const { data: serverUserLocation } = useQuery(
    lightningQueries.userLocation()
  );
  const { mutateAsync: updateLocationMutation } = useUpdateUserLocation();

  useEffect(() => {
    if (!currentLocation) {
      getCurrentPosition().then((position) => {
        if (!position) return;
        setCurrentLocation(position);
      });
      return;
    }

    const isOutOfSync =
      serverUserLocation?.latitude !== undefined &&
      serverUserLocation?.longitude !== undefined &&
      (serverUserLocation.latitude !== currentLocation.latitude ||
        serverUserLocation.longitude !== currentLocation.longitude);

    if (isOutOfSync) {
      updateLocationMutation({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    }
  }, [
    currentLocation,
    getCurrentPosition,
    serverUserLocation,
    setCurrentLocation,
    updateLocationMutation,
  ]);
};
