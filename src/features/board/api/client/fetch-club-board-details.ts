import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { boardDataDtoSchema } from "./dto.schema";
import {
  mapBoardDataDtoToBoardOverview,
  mapPostListPageDtoToPostListPage,
} from "../../lib/mappers";

export const fetchClubBoardDetails = (page = 1, size = 10) =>
  withResponseMapper({
    context: "fetchClubBoardDetails",
    fetchDto: () =>
      clientApiRequest({
        url: `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/boards/club/my?page=${String(page)}&size=${String(size)}`,
        responseSchema: boardDataDtoSchema,
      }),
    map: mapBoardDataDtoToBoardOverview,
  });

export const fetchClubPostList = (page = 1, size = 10) =>
  withResponseMapper({
    context: "fetchClubPostList",
    fetchDto: () =>
      clientApiRequest({
        url: `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/boards/club/my?page=${String(page)}&size=${String(size)}`,
        responseSchema: boardDataDtoSchema,
      }),
    map: (dto) => mapPostListPageDtoToPostListPage(dto.recentPostList),
  });
