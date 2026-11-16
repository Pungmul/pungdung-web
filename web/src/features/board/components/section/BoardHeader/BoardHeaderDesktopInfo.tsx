"use client";

import type { BoardHeaderDisplay, BoardSummary } from "../../../types";

const FALLBACK_TITLE = "알 수 없는 게시판";

interface BoardHeaderDesktopInfoProps {
  boardInfo: BoardSummary | BoardHeaderDisplay | undefined;
}

/** 데스크톱 게시판 제목. */
export function BoardHeaderDesktopInfo({
  boardInfo,
}: BoardHeaderDesktopInfoProps) {
  return (
    <div className="flex flex-col gap-[8px]">
      <h1 className="text-[27px] font-normal">
        {boardInfo?.name || FALLBACK_TITLE}
      </h1>
    </div>
  );
}
