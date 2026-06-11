import type { Address } from "@/shared/types";

/** 지도 링크 title 파라미터용 (detail | buildingName) */
export function getAddressMapTitle(
  address: Address | null | undefined
): string {
  if (!address) return "";
  return address.detail || address.buildingName || "";
}
