import type { z } from "zod";

import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import type { PostSummaryWithCategory } from "@/features/post";

import { hotPostListResponseDtoSchema } from "./dto.schema";

export type HotPostListPageDto = z.infer<typeof hotPostListResponseDtoSchema>;

export interface HotPostListResponse {
  total: number;
  list: PostSummaryWithCategory[];
  pageNum: number;
  pageSize: number;
  hasNextPage: boolean;
}

export function mapHotPostListDtoToResponse(
  dto: HotPostListPageDto
): HotPostListResponse {
  const loaded = (dto.pageNum - 1) * dto.pageSize + dto.list.length;
  return {
    ...dto,
    list: dto.list as PostSummaryWithCategory[],
    hasNextPage: loaded < dto.total,
  };
}

export const fetchHotPostList = (page = 1, size = 10) =>
  withResponseMapper({
    context: "fetchHotPostList",
    fetchDto: () =>
      clientApiRequest({
        url: `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/boards/hot-post?page=${String(page)}&size=${String(size)}`,
        responseSchema: hotPostListResponseDtoSchema,
      }),
    map: (dto): HotPostListResponse => mapHotPostListDtoToResponse(dto),
  });
