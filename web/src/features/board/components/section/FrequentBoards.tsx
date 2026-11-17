"use client";

import { useQuery } from "@tanstack/react-query";

import { XMarkIcon } from "@heroicons/react/24/outline";

import { Space, WebViewLink } from "@/shared/components";

import { useBoardBookmarks } from "../../hooks/state/useBoardBookmarks";
import { getBoardRoute } from "../../lib";
import { boardQueries } from "../../queries";

export function FrequentBoards() {
  const { ids, toggle } = useBoardBookmarks();
  const { data } = useQuery({ ...boardQueries.list(), enabled: ids.length > 0 });
  const boardList = ids.flatMap((id) => {
    const board = data?.find((item) => item.id === id);
    return board ? [board] : [];
  });

  if (boardList.length === 0) return null;
  return (
    <div className="flex min-w-0 flex-col lg:flex-row py-1 gap-1 lg:gap-4 lg:items-center">
      <h2 className="text-base font-normal flex-shrink-0 text-grey-500 px-6">
        자주 가는 게시판
      </h2>
      <ul className="flex min-w-0 max-w-full flex-row gap-2 overflow-x-auto w-fit list-none scrollbar-hide">
        <li>
          <Space w={16} />
        </li>
        {boardList.map((board) => (
          <li
            key={board.id}
            className="flex flex-row items-center gap-2 p-2 flex-shrink-0 rounded-[4px] bg-primary text-background"
          >
            <button
              type="button"
              aria-label={`${board.name} 즐겨찾기 해제`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle(board.id);
              }}
              className="size-4 flex items-center justify-center"
            >
              <XMarkIcon className="size-full" aria-hidden />
            </button>
            <WebViewLink
              href={getBoardRoute(board.id)}
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
