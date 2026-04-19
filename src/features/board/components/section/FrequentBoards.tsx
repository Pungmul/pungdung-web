"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

import { Space, WebViewLink } from "@/shared/components";

import { boardHrefSegment } from "../../lib";
import { useFrequentBoard } from "../../store";

export function FrequentBoards() {
  // 즐겨 방문 게시판 칩 목록 · 제거
  const { boardList, removeBoard } = useFrequentBoard();

  if (boardList.length === 0) return null;
  return (
    <div className="flex flex-col lg:flex-row py-1 gap-1 lg:gap-4 lg:items-center">
      <h2 className="text-base font-normal flex-shrink-0 text-grey-500 px-6">
        자주 가는 게시판
      </h2>
      <ul className="flex flex-row gap-2 overflow-x-auto w-fit list-none scrollbar-hide">
        <li>
          <Space w={16} />
        </li>
        {boardList.map((board) => (
          <li
            key={board.id}
            className="flex flex-row items-center gap-2 p-2 flex-shrink-0 rounded-[4px] bg-primary text-background"
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
              className="text-m1 cursor-pointer leading-normal"
            >
              {board.name}
            </WebViewLink>
          </li>
        ))}
        <li>
          <Space w={16} />
        </li>
      </ul>
    </div>
  );
}
