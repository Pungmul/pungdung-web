"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

import { WebViewLink } from "@/shared/components";

import { boardHrefSegment } from "../../lib";
import { sortBoardsWithBookmarks } from "../../services";
import type { BoardSummary } from "../../types";

interface BoardListProps {
  boardList: BoardSummary[];
}

const BoardList = memo(function BoardList({ boardList }: BoardListProps) {
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

  return (
    <ul className="py-3 px-2 border-0.5 border-background bg-background rounded-md flex flex-col gap-2 list-none flex-grow">
      {sortedBoardList.map((board) => {
        const isBookmarked = bookmarkedBoardList.includes(board.id);
        return (
          <BoardListItem
            key={board.id}
            isBookmarked={isBookmarked}
            board={board}
            toggleBookmark={toggleBookmark}
          />
        );
      })}
    </ul>
  );
});

export { BoardList };

const BoardListItem = memo(
  ({
    isBookmarked,
    board,
    toggleBookmark,
  }: {
    isBookmarked: boolean;
    board: BoardSummary;
    toggleBookmark: (board: BoardSummary) => void;
  }) => {
    return (
      <li className="w-full px-[12px] py-[8px] flex flex-row items-end gap-[8px]">
        <div
          className="flex justify-center items-center size-[28px] cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(board);
          }}
        >
          {isBookmarked ? (
            <StarIconSolid className="size-[24px]" color="#ffadad" />
          ) : (
            <StarIconOutline className="size-[24px]" color="#ffadad" />
          )}
        </div>
        <WebViewLink
          href={`/board/${boardHrefSegment(board.id)}`}
          className="flex-grow text-[15px] text-grey-600"
          prefetch
        >
          {board.name}
        </WebViewLink>
      </li>
    );
  }
);

BoardListItem.displayName = "BoardListItem";
