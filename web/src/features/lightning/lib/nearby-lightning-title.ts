import type { LocationSource } from "@/features/location";

export const NEARBY_LIGHTNING_TITLE_PLACEHOLDER = "우리학교 주변에 생긴 번개";

export function getNearbyLightningTitlePrefix(
  source: LocationSource | null
): string | null {
  switch (source) {
    case "gps":
      return "내 주변에 생긴";
    case "school":
      return "우리학교 주변에 생긴";
    case "seoul_station":
      return "지금 생긴";
    case null:
      return null;
  }
}
