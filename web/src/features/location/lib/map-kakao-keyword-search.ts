import type { LocationType } from "../types";

const KAKAO_SCHOOL_CATEGORY_CODE = "SC4";

export type KakaoKeywordDocument = {
  x: string;
  y: string;
  category_group_code?: string | undefined;
};

export function pickSchoolPlaceFromKakaoDocuments(
  documents: KakaoKeywordDocument[]
): LocationType | null {
  if (documents.length === 0) {
    return null;
  }

  const school =
    documents.find(
      (document) => document.category_group_code === KAKAO_SCHOOL_CATEGORY_CODE
    ) ?? documents[0];

  if (school == null) {
    return null;
  }

  const latitude = Number(school.y);
  const longitude = Number(school.x);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}
