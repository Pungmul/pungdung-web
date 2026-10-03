import { isFiniteLatLng } from "../lib";

import { fetchUserLocation, updateUserLocation } from "../api/client";
import { locationStore } from "../store/locationStore";
import type { LocationType } from "../types";

export type PersistCurrentLocationResult = "written" | "skipped" | "failed";

function isWithin200Meters(left: LocationType, right: LocationType) {
  const rad = Math.PI / 180;
  const lat = (right.latitude - left.latitude) * rad;
  const lng = (right.longitude - left.longitude) * rad;
  const a = Math.sin(lat / 2) ** 2 +
    Math.cos(left.latitude * rad) * Math.cos(right.latitude * rad) * Math.sin(lng / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(Math.min(1, a))) < 200;
}

let pendingWrite: { location: LocationType; promise: Promise<PersistCurrentLocationResult> } | null = null;

export function alignStoreToServerLocation(
  serverLocation: LocationType | null
) {
  locationStore.getState().setLocationView({
    currentLocation: isFiniteLatLng(serverLocation) ? serverLocation : null,
    locationSource: null,
    locationLabel: null,
  });
}

export async function persistCurrentLocationToServer(
  serverLocation: LocationType | null
): Promise<PersistCurrentLocationResult> {
  const { currentLocation: resolved, locationSource } = locationStore.getState();
  if (!resolved || locationSource !== "gps") {
    return "skipped";
  }

  if (pendingWrite) {
    const previous = pendingWrite;
    const result = await previous.promise;
    return persistCurrentLocationToServer(result === "written" ? previous.location : serverLocation);
  }

  if (isFiniteLatLng(serverLocation) && isWithin200Meters(serverLocation, resolved)) {
    return "skipped";
  }

  const promise = updateUserLocation(resolved)
    .then((): PersistCurrentLocationResult => "written")
    .catch((): PersistCurrentLocationResult => "failed");
  pendingWrite = { location: resolved, promise };
  try {
    return await promise;
  } finally {
    if (pendingWrite?.promise === promise) pendingWrite = null;
  }
}

export async function syncResolvedLocationToServer(
  serverLocation?: LocationType | null
): Promise<PersistCurrentLocationResult> {
  if (serverLocation === undefined) {
    const location = await fetchUserLocation();
    serverLocation = isFiniteLatLng(location) ? location : null;
  }
  return persistCurrentLocationToServer(serverLocation);
}
