"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { BoardListItem } from "./BoardListItem";
import { sortBoardsWithBookmarks } from "../../../services";
import type { BoardSummary } from "../../../types";
import { BoardGuestLoginPrompt } from "../BoardGuestLoginPrompt";

interface BoardListProps {
  boardList: BoardSummary[];
  isGuest: boolean;
}

// 비로그인 노출 순서
// 자유 0, 악기 1, 기타 공개 2, 비공개 -1
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

  return (
    <ul className="py-3 px-2 border-0.5 border-background bg-background rounded-md flex flex-col gap-2 list-none flex-grow">
      {isGuest ? (
        <>
          {guestFeaturedBoardList.map((board) => (
            <BoardListItem
              key={board.id}
              isBookmarked={bookmarkedBoardList.includes(board.id)}
              board={board}
              toggleBookmark={toggleBookmark}
              isGuest={isGuest}
            />
          ))}
          <li className="relative min-h-28 flex-grow">
            <ul
              inert
              className="flex flex-col gap-2 pointer-events-none blur-[2px] opacity-50"
            >
              {guestRestrictedBoardList.map((board) => (
                <BoardListItem
                  key={board.id}
                  isBookmarked={bookmarkedBoardList.includes(board.id)}
                  board={board}
                  toggleBookmark={toggleBookmark}
                  isGuest={isGuest}
                />
              ))}
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
        sortedBoardList.map((board) => (
          <BoardListItem
            key={board.id}
            isBookmarked={bookmarkedBoardList.includes(board.id)}
            board={board}
            toggleBookmark={toggleBookmark}
            isGuest={isGuest}
          />
        ))
      )}
    </ul>
  );
});

export { BoardList };
