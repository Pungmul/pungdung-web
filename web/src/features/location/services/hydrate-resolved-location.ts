import { hasGrantedGeolocationPermission, isFiniteLatLng } from "../lib";

import { resolveFallbackLocation } from "./resolve-fallback-location";
import { locationStore } from "../store/locationStore";
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

let hydrateInFlight: Promise<void> | null = null;

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
  if (locationStore.getState().locationSource === "gps") {
    return;
  }

  if (await hasGrantedGeolocationPermission()) {
    try {
      await locationStore.getState().requestGpsPosition();
      return;
    } catch {
      // GPS 실패 시 서버 좌표, 없으면 학교/서울역
    }
  }

  keepResolvedOrServerLocation(serverLocation);
  await applyFallbackIfUnresolved(schoolKeyword);
}

export async function hydrateResolvedLocation(
  schoolKeyword: string | null,
  serverLocation: LocationType | null = null
) {
  if (locationStore.getState().locationSource === "gps") {
    return;
  }

  if (hydrateInFlight) {
    await hydrateInFlight;
    if (locationStore.getState().locationSource != null) {
      return;
    }
  }

  hydrateInFlight = hydrateResolvedLocationOnce(
    schoolKeyword,
    serverLocation
  ).finally(() => {
    hydrateInFlight = null;
  });
  await hydrateInFlight;
}
