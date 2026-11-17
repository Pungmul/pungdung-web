import type { z } from "zod";

import { mapPostListPageDtoToPostListPage } from "./map-post-list-page";
import type { boardPostListDtoSchema } from "../../api/client/dto.schema";

export function mapBoardPostList(dto: z.infer<typeof boardPostListDtoSchema>) {
  const raw = dto.hotPost;
  const post = raw !== null && typeof raw === "object"
    ? raw as Record<string, unknown>
    : null;
  return {
    ...mapPostListPageDtoToPostListPage(dto.recentPostList),
    hotPost: post && typeof post.postId === "number" && typeof post.title === "string"
      ? { postId: post.postId, title: post.title }
      : null,
  };
}
