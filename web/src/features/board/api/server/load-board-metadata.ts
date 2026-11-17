import { cache } from "react";
import { unstable_cache } from "next/cache";

import { resolveClientApiBody } from "@/core/api/client";

import { BOARD_PUBLIC_INFO_REVALIDATE_SECONDS } from "../../constants";
import { mapBoardMetadata } from "../../lib/mappers/map-board-metadata";
import { boardMetadataDtoSchema } from "../client/dto.schema";

const BOARD_INFO_TIMEOUT_MS = 5000;

class UncacheableBoardMetadata extends Error {
  constructor(readonly info: Awaited<ReturnType<typeof fetchBoardMetadata>>) {
    super("Board metadata is not cacheable");
  }
}

async function fetchBoardMetadata(
  boardId: number,
  baseUrl: string,
  accessToken: string | undefined
) {
  try {
    const headers: Record<string, string> = {};
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    const response = await fetch(`${baseUrl}/api/boards/${boardId}/info`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(BOARD_INFO_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    return mapBoardMetadata(resolveClientApiBody(
      await response.json(), response.ok, response.status, boardMetadataDtoSchema
    ));
  } catch {
    return null;
  }
}

/** 인증 없이 조회한 공개 응답만 사용자 간 공유한다. */
const loadPublicBoardMetadata = unstable_cache(
  async (boardId: number, baseUrl: string) => {
    const info = await fetchBoardMetadata(boardId, baseUrl, undefined);
    if (!info || !info.boardInfo.isPublic) throw new UncacheableBoardMetadata(info);
    return info;
  },
  ["public-board-metadata-v1"],
  { revalidate: BOARD_PUBLIC_INFO_REVALIDATE_SECONDS }
);

/** 같은 서버 렌더 요청 안에서만 인증 정보를 사용한 조회를 공유한다. */
export const loadBoardMetadata = cache(async (
  boardId: number,
  accessToken: string | undefined
) => {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) return null;

  if (!accessToken) {
    try {
      const info = await loadPublicBoardMetadata(boardId, baseUrl);
      if (info) return info;
    } catch (error) {
      if (error instanceof UncacheableBoardMetadata) return error.info;
    }
  }
  return fetchBoardMetadata(boardId, baseUrl, accessToken);
});
