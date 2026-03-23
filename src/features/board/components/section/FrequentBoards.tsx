"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

import { WebViewLink } from "@/shared/components";

import { boardHrefSegment } from "../../lib";
import { useFrequentBoard } from "../../store";

export function FrequentBoards() {
  // 즐겨 방문 게시판 칩 목록 · 제거
  const { boardList, removeBoard } = useFrequentBoard();

  if (boardList.length === 0) return null;
  return (
    <div className="flex flex-col lg:flex-row px-[24px] py-[4px] gap-[4px] lg:gap-[16px] lg:items-center">
      <h2 className="text-[16px] font-normal flex-shrink-0 text-grey-500">
        자주 가는 게시판
      </h2>
      <ul className="flex flex-row gap-[8px] overflow-x-auto w-fit list-none scrollbar-hide">
        {boardList.map((board) => (
          <li
            key={board.id}
            className="flex flex-row items-center gap-[8px] p-[8px] flex-shrink-0 rounded-[8px] bg-primary text-background"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeBoard(board);
              }}
              className="size-4 flex items-center justify-center cursor-pointer"
            >
              <XMarkIcon className="size-full" />
            </button>
            <WebViewLink
              href={`/board/${boardHrefSegment(board.id)}`}
              className="text-[14px] cursor-pointer leading-[16px]"
            >
              {board.name}
            </WebViewLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
