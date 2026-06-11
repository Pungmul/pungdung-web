import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { boardDataDtoSchema } from "./dto.schema";
import { mapPostListPageDtoToPostListPage } from "../../lib/mappers";

export const fetchPostList = (
  boardId: number,
  page = 0,
  size = 10
) =>
  withResponseMapper({
    context: "fetchPostList",
    fetchDto: () =>
      clientApiRequest({
        url: `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/boards/${boardId}/list?page=${String(page)}&size=${String(size)}`,
        responseSchema: boardDataDtoSchema,
      }),
    map: (dto) => mapPostListPageDtoToPostListPage(dto.recentPostList),
  });
