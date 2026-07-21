"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

import { useLoginRequiredConfirmAction } from "@/features/auth";

import { WebViewLink } from "@/shared/components";

import { BoardGuestLoginPrompt } from "./BoardGuestLoginPrompt";
import { boardHrefSegment } from "../../lib";
import { sortBoardsWithBookmarks } from "../../services";
import type { BoardSummary } from "../../types";

interface BoardListProps {
  boardList: BoardSummary[];
  isGuest: boolean;
}

/** 비로그인 목록에서 자유·악기와 나머지 공개 게시판의 노출 우선순위를 반환한다. */
function getGuestFeaturedBoardOrder(board: BoardSummary): number {
  if (board.name === "자유게시판" || board.name === "자유 게시판") return 0;
  if (board.name === "악기 게시판") return 1;
  return board.isPublic ? 2 : -1;
}

const BoardList = memo(function BoardList({
  boardList,
  isGuest,
}: BoardListProps) {
  // 즐겨찾기 게시판 id 목록 · 로컬 스토리지 동기화(로드 후에만 저장)
  const [bookmarkedBoardList, setBookmarkedBoardList] = useState<
    (number | string)[]
  >([]);
  const [hasHydratedBookmarks, setHasHydratedBookmarks] = useState(false);

  const toggleBookmark = useCallback((board: BoardSummary) => {
    setBookmarkedBoardList((prev) => {
      if (prev.includes(board.id)) {
        return prev.filter((id) => id !== board.id);
      } else {
        return [...prev, board.id];
      }
    });
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("favoriteBoard");
      if (raw) {
        setBookmarkedBoardList(JSON.parse(raw));
      }
    } catch {
      localStorage.removeItem("favoriteBoard");
    } finally {
      setHasHydratedBookmarks(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedBookmarks) {
      return;
    }
    localStorage.setItem(
      "favoriteBoard",
      JSON.stringify(bookmarkedBoardList)
    );
  }, [bookmarkedBoardList, hasHydratedBookmarks]);

  // 즐겨찾기가 상단으로 오도록 정렬
  const sortedBoardList = useMemo(
    () => sortBoardsWithBookmarks(boardList, bookmarkedBoardList),
    [boardList, bookmarkedBoardList]
  );
  const guestFeaturedBoardList = useMemo(
    () =>
      sortedBoardList
        .filter((board) => getGuestFeaturedBoardOrder(board) !== -1)
        .sort(
          (left, right) =>
            getGuestFeaturedBoardOrder(left) - getGuestFeaturedBoardOrder(right)
        ),
    [sortedBoardList]
  );
  const guestRestrictedBoardList = useMemo(
    () =>
      sortedBoardList.filter(
        (board) => !board.isPublic
      ),
    [sortedBoardList]
  );

  const renderBoardListItem = (board: BoardSummary) => (
    <BoardListItem
      key={board.id}
      isBookmarked={bookmarkedBoardList.includes(board.id)}
      board={board}
      toggleBookmark={toggleBookmark}
      isGuest={isGuest}
    />
  );

  return (
    <ul className="py-3 px-2 border-0.5 border-background bg-background rounded-md flex flex-col gap-2 list-none flex-grow">
      {isGuest ? (
        <>
          {guestFeaturedBoardList.map((board) => renderBoardListItem(board))}
          <li className="relative min-h-28 flex-grow">
            <ul
              inert
              className="flex flex-col gap-2 pointer-events-none blur-[2px] opacity-50"
            >
              {guestRestrictedBoardList.map(renderBoardListItem)}
            </ul>
            <div className="absolute inset-0 z-10 [background:color-mix(in_srgb,var(--background)_70%,transparent)] backdrop-blur-sm">
              <BoardGuestLoginPrompt
                message="바로 풍덩 빠져보세요"
                messageClassNames="text-grey-500"
                showLoginButton
              />
            </div>
          </li>
        </>
      ) : (
        sortedBoardList.map((board) => renderBoardListItem(board))
      )}
    </ul>
  );
});

export { BoardList };

const BoardListItem = memo(
  ({
    isBookmarked,
    board,
    toggleBookmark,
    isGuest,
  }: {
    isBookmarked: boolean;
    board: BoardSummary;
    toggleBookmark: (board: BoardSummary) => void;
    isGuest: boolean;
  }) => {
    const { requestLogin } = useLoginRequiredConfirmAction();
    const { isPublic } = board;

    return (
      <li className="w-full px-[12px] py-[8px] flex flex-row items-center gap-[8px]">
        <div
          className="flex size-7 cursor-pointer items-center justify-center p-0.5"
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(board);
          }}
        >
          {isBookmarked ? (
            <span className="flex size-full items-center justify-center">
              <StarIconSolid className="size-full" color="#ffadad" />
            </span>
          ) : (
            <span className="flex size-full items-center justify-center">
              <StarIconOutline className="size-full" color="#ffadad" />
            </span>
          )}
        </div>
        <div
          className="flex-grow"
          onClickCapture={(event) => {
            if (!isGuest || isPublic) return;

            event.preventDefault();
            event.stopPropagation();
            requestLogin();
          }}
          onKeyDownCapture={(event) => {
            if (
              !isGuest ||
              isPublic ||
              (event.key !== "Enter" && event.key !== " ")
            ) {
              return;
            }

            event.preventDefault();
            event.stopPropagation();
            requestLogin();
          }}
        >
          <WebViewLink
            href={`/board/${boardHrefSegment(board.id)}`}
            className="text-[15px] leading-7 text-grey-600"
            prefetch
          >
            {board.name}
          </WebViewLink>
        </div>
      </li>
    );
  }
);

BoardListItem.displayName = "BoardListItem";
