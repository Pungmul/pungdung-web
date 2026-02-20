"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

import {
  boardQueries,
  deriveBoardPostList,
  deriveBoardPostListHasNextPage,
  HotPostBanner,
  useDebouncedFetchNextPage,
  useTrackBoardVisit,
} from "@/features/board";
import { PostList } from "@/features/post";

import { LinkChipButton, ListEmptyView } from "@/shared/components";

export function BoardDetailPage({ boardId }: { boardId: number }) {
  
  const { data: boardData } = useSuspenseQuery(boardQueries.detail(boardId));
  const postList = useSuspenseInfiniteQuery(boardQueries.postList(boardId));

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

  useTrackBoardVisit({ boardId, boardData });

  return (
    <section
      key="board-post-list-section"
      className="relative flex w-full flex-col bg-background"
    >
      <HotPostBanner hotPost={boardData.hotPost} />
      <PostList
        key="board-post-list"
        posts={posts}
        isLoading={postList.isFetchingNextPage}
        hasNextPage={hasNextPageForList}
        onLoadMore={loadMore}
        ListEmptyComponent={<BoardPostListEmpty boardId={boardId} />}
      />
    </section>
  );
}

function BoardPostListEmpty({ boardId }: { boardId: number }) {
  return (
    <ListEmptyView
      message="게시판에 게시글이 없어요."
      action={
        <LinkChipButton
          href={`/board/p?boardId=${boardId}`}
          filled
          className="inline-flex items-center gap-1"
        >
          이 게시판의 첫 글 쓰기
          <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
        </LinkChipButton>
      }
    />
  );
}
