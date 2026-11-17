import { cache } from "react";

import { resolveClientApiBody } from "@/core/api/client";

import { mapBoardMetadata } from "../../lib/mappers/map-board-metadata";
import { boardMetadataDtoSchema } from "../client/dto.schema";

const BOARD_INFO_TIMEOUT_MS = 5000;

/** 같은 서버 렌더 요청 안에서만 정보 조회를 공유한다. */
export const loadBoardMetadata = cache(async (
  boardId: number,
  accessToken: string | undefined
) => {
  if (!process.env.BASE_URL) return null;

  try {
    const headers: Record<string, string> = {};
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    const response = await fetch(`${process.env.BASE_URL}/api/boards/${boardId}/info`, {
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
});


