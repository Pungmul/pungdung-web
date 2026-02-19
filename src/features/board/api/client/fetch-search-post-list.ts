import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { postListPageDtoSchema } from "./dto.schema";
import { mapPostListPageDtoToPostListPage } from "../../lib/mappers";

export const fetchSearchPostList = (
  boardId: number,
  keyword: string,
  page = 0,
  size = 10
) =>
  withResponseMapper({
    context: "fetchSearchPostList",
    fetchDto: () =>
      clientApiRequest({
        url: `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/boards/${boardId}/search?keyword=${encodeURIComponent(keyword)}&page=${String(page)}&size=${String(size)}`,
        responseSchema: postListPageDtoSchema,
      }),
    map: (dto) => mapPostListPageDtoToPostListPage(dto),
  });
