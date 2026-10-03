import { isFiniteLatLng } from "../lib";
import { locationStore } from "../store";

import { persistCurrentLocationToServer } from "./persist-current-location";
import { fetchUserLocation } from "../api/client";
import type { LocationType } from "../types";

export const updateLocation = async (): Promise<LocationType> => {
  const serverLocation = await fetchUserLocation();
  let position: LocationType;
  try {
    position = await locationStore.getState().requestGpsPosition();
  } catch (error) {
    const { currentLocation, locationSource } = locationStore.getState();
    if (currentLocation && locationSource !== "gps") return currentLocation;
    throw error;
  }
  const result = await persistCurrentLocationToServer(
    isFiniteLatLng(serverLocation) ? serverLocation : null
  );
  if (result === "failed") throw new Error("위치 정보를 저장할 수 없습니다.");
  return position;
};
