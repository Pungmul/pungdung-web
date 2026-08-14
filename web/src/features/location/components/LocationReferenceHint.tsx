"use client";

import { locationStore } from "../store/locationStore";

export function LocationReferenceHint() {
  const locationSource = locationStore((state) => state.locationSource);
  const locationLabel = locationStore((state) => state.locationLabel);

  if (
    locationSource === "gps" ||
    locationSource == null ||
    locationLabel == null ||
    locationLabel === ""
  ) {
    return null;
  }

  return (
    <p className="text-[12px] text-grey-500">{`기준: ${locationLabel}`}</p>
  );
}
