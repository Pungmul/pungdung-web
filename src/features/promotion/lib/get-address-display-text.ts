import type { Address } from "@/shared/types";

/** 표시용 주소 텍스트 (detail | buildingName | "주소 없음") */
export function getAddressDisplayText(
  address: Address | null | undefined
): string {
  if (!address) return "주소 없음";
  return address.detail || address.buildingName || "주소 없음";
}
