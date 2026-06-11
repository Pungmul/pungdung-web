"use client";

import { useRouter } from "next/navigation";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Header } from "@/shared";

import {
  type BoardHeaderSearchKeyword,
  useBoardHeaderMobileSearchPanel,
  useBoardHeaderMobileSearchRowHeight,
} from "../../../hooks/view-model";
import type { BoardHeaderDisplay, BoardSummary } from "../../../types";
import { BoardHeaderSearchField } from "../../ui/BoardHeaderSearchField";

const FALLBACK_TITLE = "알 수 없는 게시판";

interface BoardHeaderMobileProps {
  boardID: string;
  boardInfo: BoardSummary | BoardHeaderDisplay | undefined;
  goToBoardMain: () => void;
  keyword: BoardHeaderSearchKeyword;
  searchable?: boolean;
}

/** 모바일: 상단 헤더(제목·뒤로) + 검색 아이콘 + 검색 입력 줄 */
export function BoardHeaderMobile({
  boardID,
  boardInfo,
  goToBoardMain,
  keyword,
  searchable = true,
}: BoardHeaderMobileProps) {
  const router = useRouter();

  const { isSearching, openMobileSearch, closeMobileSearchPanel } =
    useBoardHeaderMobileSearchPanel();

  const { mobileSearchRowRef, mobileSearchHeightPx } =
    useBoardHeaderMobileSearchRowHeight(isSearching);

  const navigateToSearch = () => {
    router.push(
      `/board/${Number(boardID)}/search?keyword=${encodeURIComponent(keyword.searchValue)}`
    );
  };

  const clearMobileSearch = () => {
    closeMobileSearchPanel();
    keyword.resetKeyword();
  };

  return (
    <nav className="flex flex-col sticky top-0 z-20 bg-background">
      <Header
        title={boardInfo?.name || FALLBACK_TITLE}
        bottomGradientOffsetPx={isSearching ? mobileSearchHeightPx : 0}
        {...(searchable
          ? {
            rightBtn: (
              <span
                className="flex size-6 items-center justify-center cursor-pointer"
                onClick={openMobileSearch}
              >
                <MagnifyingGlassIcon className="size-full" color="#CCC" />
              </span>
            ),
          }
          : {})}
        onLeftClick={goToBoardMain}
        className="z-20"
      />
      {searchable && isSearching ? (
        <div
          ref={mobileSearchRowRef}
          className="flex flex-row gap-[8px] px-[12px] py-[4px] bg-background"
        >
          <BoardHeaderSearchField
            searchValue={keyword.searchValue}
            onSearchValueChange={keyword.setSearchValue}
            onSubmitSearch={navigateToSearch}
            onClear={clearMobileSearch}
          />
        </div>
      ) : null}
    </nav>
  );
}
