import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { boardPostListDtoSchema } from "./dto.schema";
import { mapBoardPostList } from "../../lib/mappers/map-board-post-list";

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
        responseSchema: boardPostListDtoSchema,
      }),
    map: mapBoardPostList,
  });
