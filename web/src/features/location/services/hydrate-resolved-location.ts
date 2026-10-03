import { isFiniteLatLng } from "../lib";

import { resolveFallbackLocation } from "./resolve-fallback-location";
import { hasRecentGpsPosition, locationStore } from "../store/locationStore";
import type { LocationType } from "../types";

function hasResolvedLocation() {
  const { currentLocation, locationSource } = locationStore.getState();
  return locationSource != null || currentLocation != null;
}

async function applyFallbackIfUnresolved(schoolKeyword: string | null) {
  if (hasResolvedLocation()) {
    return;
  }

  const resolved = await resolveFallbackLocation(schoolKeyword);
  if (hasResolvedLocation()) {
    return;
  }

  locationStore
    .getState()
    .setResolvedLocation(resolved.location, resolved.source, resolved.label);
}

let hydrateInFlight: Promise<boolean> | null = null;

function keepResolvedOrServerLocation(serverLocation: LocationType | null) {
  if (hasResolvedLocation()) {
    return;
  }

  if (!isFiniteLatLng(serverLocation)) {
    return;
  }

  locationStore.getState().setLocationView({
    currentLocation: serverLocation,
    locationSource: null,
    locationLabel: null,
  });
}

async function hydrateResolvedLocationOnce(
  schoolKeyword: string | null,
  serverLocation: LocationType | null
) {
  if (hasRecentGpsPosition()) return true;
  const initialLocation = locationStore.getState().currentLocation;
  try {
    await locationStore.getState().requestGpsPosition();
    return true;
  } catch {
    // GPS 실패 시 서버 좌표, 없으면 학교/서울역
  }

  if (locationStore.getState().locationSource === "gps" && locationStore.getState().currentLocation === initialLocation) {
    locationStore.getState().setLocationView({ currentLocation: null, locationSource: null, locationLabel: null });
  }
  keepResolvedOrServerLocation(serverLocation);
  await applyFallbackIfUnresolved(schoolKeyword);
  return false;
}

export async function hydrateResolvedLocation(
  schoolKeyword: string | null,
  serverLocation: LocationType | null = null
) {
  if (hydrateInFlight) {
    return hydrateInFlight;
  }

  hydrateInFlight = hydrateResolvedLocationOnce(
    schoolKeyword,
    serverLocation
  ).finally(() => {
    hydrateInFlight = null;
  });
  return hydrateInFlight;
}
