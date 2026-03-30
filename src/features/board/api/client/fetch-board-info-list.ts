import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { briefBoardInfoListDtoSchema } from "./dto.schema";
import { mapBriefBoardInfoDtoToBoardSummary } from "../../lib/mappers";
import type { BoardSummary } from "../../types";

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

export const fetchBoardInfoList = () =>
  withResponseMapper({
    context: "fetchBoardInfoList",
    fetchDto: () =>
      clientApiRequest({
        url: `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/boards`,
        responseSchema: briefBoardInfoListDtoSchema,
      }),
    map: (list) => [
      ...list.map(mapBriefBoardInfoDtoToBoardSummary),
      CLUB_BOARD,
      PROMOTE_BOARD,
    ],
  });
