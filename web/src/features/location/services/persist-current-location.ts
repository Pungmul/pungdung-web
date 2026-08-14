import { isFiniteLatLng } from "../lib";

import { updateUserLocation } from "../api/client";
import { locationStore } from "../store/locationStore";
import type { LocationType } from "../types";

export type PersistCurrentLocationResult = "written" | "skipped" | "failed";

function isSameLatLng(left: LocationType, right: LocationType) {
  return (
    left.latitude === right.latitude && left.longitude === right.longitude
  );
}

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
  const resolved = locationStore.getState().currentLocation;
  if (!resolved) {
    return "skipped";
  }

  if (isFiniteLatLng(serverLocation) && isSameLatLng(serverLocation, resolved)) {
    return "skipped";
  }

  try {
    await updateUserLocation({
      latitude: resolved.latitude,
      longitude: resolved.longitude,
    });
    return "written";
  } catch {
    return "failed";
  }
}

export async function syncResolvedLocationToServer(
  serverLocation: LocationType | null
): Promise<PersistCurrentLocationResult> {
  const result = await persistCurrentLocationToServer(serverLocation);
  if (result === "failed") {
    alignStoreToServerLocation(serverLocation);
  }
  return result;
}
