import { queryOptions } from "@tanstack/react-query";

import { fetchPostDetail, isPostDeletedError } from "../api/client";

const postKey = ["post"] as const;

export const postQueries = {
  all: () => postKey,
  lists: () => [...postQueries.all(), "list"] as const,
  list: (boardId?: number | null) =>
    boardId !== undefined && boardId !== null
      ? ([...postQueries.lists(), boardId] as const)
      : postQueries.lists(),
  details: () => [...postQueries.all(), "detail"] as const,
  detailKey: (postId?: number | null) =>
    postId !== undefined && postId !== null
      ? ([...postQueries.details(), postId] as const)
      : postQueries.details(),
  detail: (postId: number | null) =>
    queryOptions({
      queryKey: postQueries.detailKey(postId),
      queryFn: () => {
        if (!postId) {
          return null;
        }
        return fetchPostDetail(postId);
      },
      staleTime: 1000 * 5,
      retry: (failureCount, error) => {
        if (isPostDeletedError(error)) return false;
        return failureCount < 2;
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }),
  like: (postId: number) => [...postQueries.all(), "like", postId] as const,
};
