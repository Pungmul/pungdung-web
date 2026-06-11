"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import {
  boardQueries,
  flattenInfinitePages,
  useDebouncedFetchNextPage,
} from "@/features/board";
import type { PostSummaryWithCategory } from "@/features/post";
import { PostWithCategoryNameList } from "@/features/post";

import { ListEmptyView } from "@/shared/components";

export function HotPostList() {
  const infinite = useSuspenseInfiniteQuery(boardQueries.hotPostList());
  const posts = flattenInfinitePages<PostSummaryWithCategory>(infinite.data);
  const { loadMore } = useDebouncedFetchNextPage({
    fetchNextPage: infinite.fetchNextPage,
    hasNextPage: infinite.hasNextPage,
    isFetchingNextPage: infinite.isFetchingNextPage,
  });

  return (
    <PostWithCategoryNameList
      posts={posts}
      isLoading={infinite.isFetchingNextPage}
      hasNextPage={infinite.hasNextPage}
      onLoadMore={loadMore}
      ListEmptyComponent={
        <ListEmptyView message="아직 뜨는 인기글이 없어요." />
      }
    />
  );
}
