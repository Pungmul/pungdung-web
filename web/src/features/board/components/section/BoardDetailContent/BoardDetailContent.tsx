"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

import { ClientApiError } from "@/core/api/client";

import { useLoginRequiredConfirmAction } from "@/features/auth";
import { PostBoxSkeleton, PostList } from "@/features/post";

import { LinkChipButton, ListEmptyView, Spinner } from "@/shared/components";

import { useRefreshBoardPosts } from "../../../hooks/actions/useRefreshBoardPosts";
import { useBoardPullToRefresh } from "../../../hooks/state/useBoardPullToRefresh";
import { useDebouncedFetchNextPage } from "../../../hooks/view-model/useDebouncedFetchNextPage";
import { boardQueries } from "../../../queries";
import { HotPostBanner } from "../../ui/HotPostBanner";
import { HotPostBannerSkeleton } from "../../ui/HotPostBannerSkeleton";

export interface BoardDetailContentProps {
  boardId: number;
  /** 탭 선택에 따라 게시글·핫글을 조회할 게시판 ID */
  postListBoardId: number;
  isGuest: boolean;
}

/**
 * 게시판 상세 본문: 선택된 boardId 기준 핫글 배너 + 무한 스크롤 게시글 목록.
 * `Suspense` 경계 안에서 렌더한다.
 */
export function BoardDetailContent({
  boardId,
  postListBoardId,
  isGuest,
}: BoardDetailContentProps) {
  const postList = useSuspenseInfiniteQuery(
    boardQueries.postList(postListBoardId)
  );

  const { refresh, isRefreshing, error: refreshError } = useRefreshBoardPosts(postListBoardId, boardId);
  const pull = useBoardPullToRefresh(refresh, isRefreshing);

  const posts = postList.data.pages.flatMap((page) => page.list);
  const hasNextPageForList = postList.hasNextPage;
  const { loadMore } = useDebouncedFetchNextPage({
    fetchNextPage: postList.fetchNextPage,
    hasNextPage: hasNextPageForList && !isRefreshing,
    isFetchingNextPage: postList.isFetchingNextPage,
  });

  if (refreshError instanceof ClientApiError && refreshError.status === 403) throw refreshError;

  if (postList.error instanceof ClientApiError && postList.error.status === 403)
    throw postList.error;

  return (
    <>
      <div
        className={`flex items-center justify-center overflow-hidden md:hidden ${isRefreshing || pull.distance === 0 ? "transition-[height] duration-200" : ""}`}
        style={{ height: isRefreshing ? 48 : pull.distance }}
        aria-hidden="true"
      >
        <div style={{ opacity: isRefreshing ? 1 : Math.min(pull.distance / 30, 1) }}>
          <Spinner size={30} baseColor="#F3F4F6" highlightColor="#9CA3AF" {...(!isRefreshing ? { progress: pull.progress } : {})} />
        </div>
      </div>
      <div aria-live="polite" className="text-center text-xs text-grey-500 md:hidden">
        <span className="sr-only">{isRefreshing ? "새로고침 중" : pull.ready ? "놓으면 새로고침" : ""}</span>
        {refreshError && !(refreshError instanceof ClientApiError && refreshError.status === 403) ? "새로고침하지 못했어요. 다시 시도해 주세요." : null}
      </div>
      <button type="button" onClick={() => void refresh()} disabled={isRefreshing} className="sr-only focus:not-sr-only">
        게시글 새로고침
      </button>
      <HotPostBanner hotPost={postList.data.pages[0]?.hotPost ?? null} />
      <PostList
        key={`board-post-list-${postListBoardId}`}
        posts={posts}
        isLoading={postList.isFetchingNextPage}
        hasNextPage={hasNextPageForList && !isRefreshing}
        onLoadMore={loadMore}
        ListEmptyComponent={
          <BoardPostListEmpty boardId={postListBoardId} isGuest={isGuest} />
        }
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

function BoardPostListEmpty({
  boardId,
  isGuest,
}: {
  boardId: number;
  isGuest: boolean;
}) {
  const { requestLogin } = useLoginRequiredConfirmAction();

  return (
    <ListEmptyView
      message="게시판에 게시글이 없어요."
      action={
        <LinkChipButton
          href={`/board/p?boardId=${boardId}`}
          filled
          className="inline-flex items-center gap-1"
          onClick={(event) => {
            if (!isGuest) {
              return;
            }

            event.preventDefault();
            requestLogin();
          }}
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
