"use client";

import { Suspense } from "@suspensive/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import {
  BoardChildCategoryTabs,
  BoardDetailContent,
  BoardDetailContentLoading,
} from "@/features/board/components";

import { boardQueries } from "@/features/board/queries";

import { useBoardTabNavigation } from "@/features/board/hooks/view-model";
import { useTrackBoardVisit } from "@/features/board/hooks/actions";
import { SkeletonView } from "@/shared";


/** 게시판 상세: 자식 탭·게시글 목록·핫글 배너를 조합하는 클라이언트 페이지 */
export function BoardDetailPage({ boardId }: { boardId: number }) {
  const { data: boardData } = useSuspenseQuery(boardQueries.detail(boardId));
  const {
    hasChildCategories,
    effectiveChildCategories,
    selectedCategory,
    postListBoardId,
    handleCategoryChange,
  } = useBoardTabNavigation({
    boardId,
    childCategories: boardData.boardInfo.childCategories,
  });
  useTrackBoardVisit({ boardId, boardData });

  return (
    <section
      key="board-post-list-section"
      className="relative flex w-full flex-col bg-background"
    >
      {hasChildCategories ?
        selectedCategory ? (
          <BoardChildCategoryTabs
            categories={effectiveChildCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        ) :
          <SkeletonView className="w-80 h-10 rounded-sm" />
        : null}
      <Suspense
        key={`board-detail-content-${postListBoardId}`}
        fallback={<BoardDetailContentLoading />}
      >
        <BoardDetailContent
          boardData={boardData}
          postListBoardId={postListBoardId}
          hasChildCategories={hasChildCategories}
        />
      </Suspense>
    </section>
  );
}
