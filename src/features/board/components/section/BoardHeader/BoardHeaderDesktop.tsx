"use client";

import { useRouter } from "next/navigation";

import { BoardHeaderDesktopInfo } from "./BoardHeaderDesktopInfo";
import type { BoardHeaderSearchKeyword } from "../../../hooks/view-model";
import type { BoardHeaderDisplay, BoardSummary } from "../../../types";
import { BoardHeaderSearchField } from "../../ui/BoardHeaderSearchField";

interface BoardHeaderDesktopProps {
  boardID: string;
  boardInfo: BoardSummary | BoardHeaderDisplay | undefined;
  categoryDescription?: string;
  keyword: BoardHeaderSearchKeyword;
}

/** 데스크톱: 게시판 정보 + 검색 필드 한 행 */
export function BoardHeaderDesktop({
  boardID,
  boardInfo,
  categoryDescription,
  keyword,
}: BoardHeaderDesktopProps) {
  const router = useRouter();

  const navigateToSearch = () => {
    router.push(
      `/board/${Number(boardID)}/search?keyword=${encodeURIComponent(keyword.searchValue)}`
    );
  };

  return (
    <div className="flex flex-row justify-between gap-[12px] mx-auto w-full px-[24px] max-w-[960px] py-[48px] bg-background">
      <BoardHeaderDesktopInfo
        boardInfo={boardInfo}
        {...(categoryDescription !== undefined
          ? { categoryDescription }
          : {})}
      />
      <BoardHeaderSearchField
        searchValue={keyword.searchValue}
        onSearchValueChange={keyword.setSearchValue}
        onSubmitSearch={navigateToSearch}
        onClear={keyword.resetKeyword}
        containerClassName="w-[320px] h-fit"
      />
    </div>
  );
}
