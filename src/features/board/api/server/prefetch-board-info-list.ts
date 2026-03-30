"use server";

import { resolveClientApiBody, withResponseMapper } from "@/core/api/client";

import { BOARD_INFO_LIST_REVALIDATE_SECONDS } from "../../constants";
import { mapBriefBoardInfoDtoToBoardSummary } from "../../lib/mappers";
import type { BoardSummary } from "../../types";
import { briefBoardInfoListDtoSchema } from "../client/dto.schema";

const PROMOTE_BOARD: BoardSummary = {
  id: "promote",
  parentId: null,
  name: "홍보 게시판",
  description: "공연 모집 정보를 공유하는 게시판입니다",
};

const CLUB_BOARD: BoardSummary = {
  id: "club",
  parentId: null,
  name: "동아리 게시판",
  description: "소속 동아리의 게시글을 확인하는 게시판입니다",
};

function resolveServerBoardsUrl(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_BASE_URL is required for prefetchBoardInfoList server fetch."
    );
  }

  return `${base.replace(/\/$/, "")}/api/boards`;
}

export const prefetchBoardInfoList = async () =>
  withResponseMapper({
    context: "prefetchBoardInfoList",
    fetchDto: async () => {
      const response = await fetch(resolveServerBoardsUrl(), {
        next: {
          revalidate: BOARD_INFO_LIST_REVALIDATE_SECONDS,
        },
      });
      const raw_data = await response.json().catch(() => null);
      return resolveClientApiBody(
        raw_data,
        response.ok,
        response.status,
        briefBoardInfoListDtoSchema
      );
    },
    map: (list) => [
      ...list.map(mapBriefBoardInfoDtoToBoardSummary),
      CLUB_BOARD,
      PROMOTE_BOARD,
    ],
  });
