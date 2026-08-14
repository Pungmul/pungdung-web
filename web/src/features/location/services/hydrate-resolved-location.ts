import { resolveFallbackLocation } from "./resolve-fallback-location";
import { locationStore } from "../store/locationStore";

async function hasGrantedGeolocationPermission(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) {
    return false;
  }

  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state === "granted";
  } catch {
    return false;
  }
}

async function applyFallbackIfUnresolved(schoolKeyword: string | null) {
  if (locationStore.getState().locationSource != null) {
    return;
  }

  const resolved = await resolveFallbackLocation(schoolKeyword);
  if (locationStore.getState().locationSource != null) {
    return;
  }

  locationStore
    .getState()
    .setResolvedLocation(resolved.location, resolved.source, resolved.label);
}

let hydrateInFlight: Promise<void> | null = null;

async function hydrateResolvedLocationOnce(schoolKeyword: string | null) {
  if (locationStore.getState().locationSource != null) {
    return;
  }

  if (await hasGrantedGeolocationPermission()) {
    try {
      await locationStore.getState().requestGpsPosition();
      return;
    } catch {
      // GPS 실패 시 학교/서울역
    }
  }

  await applyFallbackIfUnresolved(schoolKeyword);
}

export async function hydrateResolvedLocation(schoolKeyword: string | null) {
  if (locationStore.getState().locationSource != null) {
    return;
  }

  if (hydrateInFlight) {
    await hydrateInFlight;
    if (locationStore.getState().locationSource != null) {
      return;
    }
  }

  hydrateInFlight = hydrateResolvedLocationOnce(schoolKeyword).finally(() => {
    hydrateInFlight = null;
  });
  await hydrateInFlight;
}
