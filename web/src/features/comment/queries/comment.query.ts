import { queryOptions } from "@tanstack/react-query";

import { fetchCommentList } from "../api/client";

const commentKey = ["comment"] as const;

export const commentQueries = {
  all: () => commentKey,
  lists: () => [...commentQueries.all(), "list"] as const,
  listKey: (postId: number) => [...commentQueries.lists(), postId] as const,
  list: (postId: number) =>
    queryOptions({
      queryKey: commentQueries.listKey(postId),
      queryFn: () => fetchCommentList(postId),
    }),
};
