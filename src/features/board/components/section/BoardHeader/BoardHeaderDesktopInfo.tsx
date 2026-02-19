"use client";

import type { BoardHeaderDisplay, BoardSummary } from "../../../types";

const FALLBACK_TITLE = "알 수 없는 게시판";

interface BoardHeaderDesktopInfoProps {
  boardInfo: BoardSummary | BoardHeaderDisplay | undefined;
  /** `/api/boards/:id/info`의 boardInfo(카테고리 경로). 있으면 설명 줄에 우선 표시 */
  categoryDescription?: string;
}

/** 데스크톱: 게시판 이름·설명 블록. */
export function BoardHeaderDesktopInfo({
  boardInfo,
  categoryDescription,
}: BoardHeaderDesktopInfoProps) {
  const description =
    categoryDescription?.trim() ||
    boardInfo?.description ||
    FALLBACK_TITLE;

  return (
    <div className="flex flex-col gap-[8px]">
      <h1 className="text-[27px] font-normal">
        {boardInfo?.name || FALLBACK_TITLE}
      </h1>
      <div className="text-[14px] text-grey-500">{description}</div>
    </div>
  );
}
