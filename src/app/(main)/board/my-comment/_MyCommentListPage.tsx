"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import {
  boardQueries,
  flattenInfinitePages,
  useDebouncedFetchNextPage,
} from "@/features/board";
import { CommentWithPostList, type MyComment } from "@/features/comment";

export function MyCommentListPage() {
  const infinite = useSuspenseInfiniteQuery(boardQueries.myCommentList());
  const comments = flattenInfinitePages<MyComment>(infinite.data);
  const { loadMore } = useDebouncedFetchNextPage({
    fetchNextPage: infinite.fetchNextPage,
    hasNextPage: infinite.hasNextPage,
    isFetchingNextPage: infinite.isFetchingNextPage,
  });

  return (
    <CommentWithPostList
      comments={comments}
      isLoading={infinite.isFetchingNextPage}
      hasNextPage={infinite.hasNextPage}
      onLoadMore={loadMore}
    />
  );
}
