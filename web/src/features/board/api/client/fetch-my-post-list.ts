import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import type { PagedMyPosts } from "@/features/post";

import { myPostListPageDtoSchema } from "./dto.schema";
import { mapMyPostListPageDtoToPagedMyPosts } from "../../lib/mappers/map-my-post-list-page";

export const fetchMyPostList = (page: number, size = 10) =>
  withResponseMapper({
    context: "fetchMyPostList",
    fetchDto: () =>
      clientApiRequest({
        url: `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/posts/me?page=${String(page)}&size=${String(size)}`,
        responseSchema: myPostListPageDtoSchema,
      }),
    map: (dto): PagedMyPosts => mapMyPostListPageDtoToPagedMyPosts(dto),
  });
