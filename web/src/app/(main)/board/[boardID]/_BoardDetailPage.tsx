"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { ClientApiError } from "@/core/api/client";

import { BoardDetailContent } from "@/features/board/components";
import { useTrackBoardVisit } from "@/features/board/hooks/actions";
import { useBoardTabNavigation } from "@/features/board/hooks/view-model";
import { boardQueries } from "@/features/board/queries";

/** 게시판 상세의 탭 선택과 게시글 목록을 연결한다. */
export function BoardDetailPage({
  boardId,
  isGuest,
}: {
  boardId: number;
  isGuest: boolean;
}) {
  const { data: boardData, error } = useSuspenseQuery(
    boardQueries.boardInfo(boardId)
  );
  const { selectedCategory, postListBoardId } = useBoardTabNavigation({
    boardId,
    childCategories: boardData.boardInfo.childCategories,
    syncUrl: false,
  });
  useTrackBoardVisit({
    boardId,
    boardData,
    selectedCategory,
  });

  if (error instanceof ClientApiError && error.status === 403) throw error;

  return (
    <section
      key="board-post-list-section"
      className="relative flex w-full flex-col bg-background"
    >
      <BoardDetailContent
        key={`board-detail-content-${postListBoardId}`}
        boardId={boardId}
        postListBoardId={postListBoardId}
        isGuest={isGuest}
      />
    </section>
  );
}
