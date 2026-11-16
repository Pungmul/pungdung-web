import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { boardPostListDtoSchema } from "./dto.schema";
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
        responseSchema: boardPostListDtoSchema,
      }),
    map: (dto) => {
      const hotPost = dto.hotPost;
      const post = hotPost !== null && typeof hotPost === "object"
        ? hotPost as Record<string, unknown>
        : null;
      return {
        ...mapPostListPageDtoToPostListPage(dto.recentPostList),
        hotPost: post && typeof post.postId === "number" && typeof post.title === "string"
          ? { postId: post.postId, title: post.title }
          : null,
      };
    },
  });
