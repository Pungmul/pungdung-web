"use server";

import { kakaoKeywordSearchResponseSchema } from "./dto.schema";
import { pickSchoolPlaceFromKakaoDocuments } from "../../lib";
import type { LocationType } from "../../types";

const KAKAO_KEYWORD_SEARCH_REVALIDATE_SECONDS = 60 * 60 * 24;

async function loadSchoolPlaceFromKakao(
  keyword: string
): Promise<LocationType | null> {
  const restKey = process.env.NEXT_PUBLIC_KAKAO_REST_KEY;
  if (!restKey) {
    throw new Error("Kakao REST key is missing");
  }

  const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
  url.searchParams.set("query", keyword);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${restKey}`,
    },
    next: {
      revalidate: KAKAO_KEYWORD_SEARCH_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Kakao keyword search failed: ${response.status}`);
  }

  const raw: unknown = await response.json();
  const parsed = kakaoKeywordSearchResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("Kakao keyword search payload is invalid");
  }

  return pickSchoolPlaceFromKakaoDocuments(parsed.data.documents);
}

export async function searchSchoolPlaceByKeyword(
  keyword: string
): Promise<LocationType | null> {
  const trimmed = keyword.trim();
  if (trimmed === "") {
    return null;
  }

  try {
    return await loadSchoolPlaceFromKakao(trimmed);
  } catch {
    return null;
  }
}
