"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

import {
  boardQueries,
  BoardChildCategoryTabs,
  deriveBoardPostList,
  deriveBoardPostListHasNextPage,
  HotPostBanner,
  useDebouncedFetchNextPage,
  useTrackBoardVisit,
} from "@/features/board";
import { PostList } from "@/features/post";

import { LinkChipButton, ListEmptyView } from "@/shared/components";

export function BoardDetailPage({ boardId }: { boardId: number }) {
  const searchParams = useSearchParams();
  const { data: boardData } = useSuspenseQuery(boardQueries.detail(boardId));
  const childCategories = boardData.boardInfo.childCategories;
  const hasChildCategories = childCategories.length > 0;
  const selectedCategory =
    childCategories.find(
      (category) => String(category.id) === searchParams.get("tab")
    ) ?? childCategories[0];
  const postListBoardId = selectedCategory?.id ?? boardId;
  const postList = useSuspenseInfiniteQuery(
    boardQueries.postList(postListBoardId)
  );

  const posts = deriveBoardPostList(
    hasChildCategories ? undefined : boardData,
    postList.data
  );
  const hasNextPageForList = deriveBoardPostListHasNextPage(
    hasChildCategories ? undefined : boardData,
    postList.data,
    postList.hasNextPage
  );
  const { loadMore } = useDebouncedFetchNextPage({
    fetchNextPage: postList.fetchNextPage,
    hasNextPage: hasNextPageForList,
    isFetchingNextPage: postList.isFetchingNextPage,
  });

  useTrackBoardVisit({ boardId, boardData });

  const handleCategoryChange = useCallback(
    (category: NonNullable<typeof selectedCategory>) => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", String(category.id));
      window.history.pushState(
        null,
        "",
        `/board/${boardId}?${params.toString()}`
      );
    },
    [boardId, searchParams]
  );

  return (
    <section
      key="board-post-list-section"
      className="relative flex w-full flex-col bg-background"
    >
      {selectedCategory ? (
        <BoardChildCategoryTabs
          categories={childCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      ) : null}
      <HotPostBanner hotPost={boardData.hotPost} />
      <PostList
        key={`board-post-list-${postListBoardId}`}
        posts={posts}
        isLoading={postList.isFetchingNextPage}
        hasNextPage={hasNextPageForList}
        onLoadMore={loadMore}
        ListEmptyComponent={<BoardPostListEmpty boardId={postListBoardId} />}
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
          <span className="size-4 flex items-center justify-center flex-shrink-0">
            <ChevronRightIcon className="size-full" />
          </span>
        </LinkChipButton>
      }
    />
  );
}
