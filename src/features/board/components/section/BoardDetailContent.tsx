"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

import { PostBoxSkeleton, PostList } from "@/features/post";

import { LinkChipButton, ListEmptyView } from "@/shared/components";

import { useDebouncedFetchNextPage } from "../../hooks/view-model/useDebouncedFetchNextPage";
import { boardQueries } from "../../queries";
import {
  deriveBoardPostList,
  deriveBoardPostListHasNextPage,
} from "../../services";
import type { BoardOverview } from "../../types";
import { HotPostBanner } from "../ui/HotPostBanner";
import { HotPostBannerSkeleton } from "../ui/HotPostBannerSkeleton";

export interface BoardDetailContentProps {
  /** 루트 게시판 상세(자식 탭 없을 때 목록 폴백 소스) */
  boardData: BoardOverview;
  /** 탭 선택에 따라 게시글·핫글을 조회할 게시판 ID */
  postListBoardId: number;
  /** 자식 카테고리 탭 존재 여부. `true`이면 부모 `recentPostList` 폴백을 쓰지 않는다 */
  hasChildCategories: boolean;
}

/**
 * 게시판 상세 본문: 선택된 boardId 기준 핫글 배너 + 무한 스크롤 게시글 목록.
 * `Suspense` 경계 안에서 렌더한다.
 */
export function BoardDetailContent({
  boardData,
  postListBoardId,
  hasChildCategories,
}: BoardDetailContentProps) {
  const { data: postListBoardData } = useSuspenseQuery(
    boardQueries.detail(postListBoardId)
  );
  const postList = useSuspenseInfiniteQuery(
    boardQueries.postList(postListBoardId)
  );

  const boardOverviewForListFallback = hasChildCategories
    ? undefined
    : boardData;

  const posts = deriveBoardPostList(
    boardOverviewForListFallback,
    postList.data
  );
  const hasNextPageForList = deriveBoardPostListHasNextPage(
    boardOverviewForListFallback,
    postList.data,
    postList.hasNextPage
  );
  const { loadMore } = useDebouncedFetchNextPage({
    fetchNextPage: postList.fetchNextPage,
    hasNextPage: hasNextPageForList,
    isFetchingNextPage: postList.isFetchingNextPage,
  });

  return (
    <>
      <HotPostBanner hotPost={postListBoardData.hotPost} />
      <PostList
        key={`board-post-list-${postListBoardId}`}
        posts={posts}
        isLoading={postList.isFetchingNextPage}
        hasNextPage={hasNextPageForList}
        onLoadMore={loadMore}
        ListEmptyComponent={<BoardPostListEmpty boardId={postListBoardId} />}
      />
    </>
  );
}

/** `BoardDetailContent` Suspense fallback: 핫글 스켈레톤 + 게시글 목록 스켈레톤 */
export function BoardDetailContentLoading() {
  return (
    <>
      <div aria-busy aria-label="게시판 로딩">
        <HotPostBannerSkeleton />
      </div>
      <PostBoxSkeleton length={8} />
    </>
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
