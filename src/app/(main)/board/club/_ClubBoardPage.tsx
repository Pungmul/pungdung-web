"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  boardQueries,
  deriveBoardPostList,
  deriveBoardPostListHasNextPage,
  HotPostBanner,
  useDebouncedFetchNextPage,
} from "@/features/board";
import { PostList } from "@/features/post";

import { ListEmptyView } from "@/shared/components";

export function ClubBoardPage() {
  const { data: boardData } = useSuspenseQuery(boardQueries.clubDetail());
  const postList = useSuspenseInfiniteQuery(boardQueries.clubPostList());

  const posts = deriveBoardPostList(boardData, postList.data);
  const hasNextPageForList = deriveBoardPostListHasNextPage(
    boardData,
    postList.data,
    postList.hasNextPage
  );
  const { loadMore } = useDebouncedFetchNextPage({
    fetchNextPage: postList.fetchNextPage,
    hasNextPage: hasNextPageForList,
    isFetchingNextPage: postList.isFetchingNextPage,
  });

  return (
    <section
      key="club-board-post-list-section"
      className="relative flex w-full flex-col bg-background"
    >
      <HotPostBanner hotPost={boardData.hotPost} />
      <PostList
        key="club-board-post-list"
        posts={posts}
        isLoading={postList.isFetchingNextPage}
        hasNextPage={hasNextPageForList}
        onLoadMore={loadMore}
        ListEmptyComponent={
          <ListEmptyView message="동아리 게시판에 게시글이 없어요." />
        }
      />
    </section>
  );
}
