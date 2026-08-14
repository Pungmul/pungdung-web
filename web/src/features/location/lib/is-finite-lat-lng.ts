import type { LocationType } from "../types";

export function isFiniteLatLng(location: unknown): location is LocationType {
  if (typeof location !== "object" || location === null) {
    return false;
  }

  const { latitude, longitude } = location as {
    latitude?: unknown;
    longitude?: unknown;
  };

  return (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  );
}
