import { searchSchoolPlaceByKeyword } from "../api/server";
import { MAP_LOCATION_FALLBACK } from "../constant";
import type { LocationSource, LocationType } from "../types";

export async function resolveFallbackLocation(
  schoolKeyword: string | null
): Promise<{
  location: LocationType;
  source: Exclude<LocationSource, "gps">;
  label: string;
}> {
  const keyword = schoolKeyword?.trim() ? schoolKeyword.trim() : null;
  if (keyword) {
    const school = await searchSchoolPlaceByKeyword(keyword);
    if (school) {
      return { location: school, source: "school", label: keyword };
    }
  }

  return {
    location: MAP_LOCATION_FALLBACK,
    source: "seoul_station",
    label: "서울역",
  };
}
