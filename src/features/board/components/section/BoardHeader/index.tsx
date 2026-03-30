"use client";

import { Responsive } from "@/shared/components/Responsive";

import { BoardHeaderDesktop } from "./BoardHeaderDesktop";
import { BoardHeaderMobile } from "./BoardHeaderMobile";
import {
  useBoardHeaderMeta,
  useBoardHeaderSearchKeyword,
} from "../../../hooks/view-model";
import type { BoardHeaderDisplay } from "../../../types";

interface BoardHeaderProps {
  boardID: string;
  initialBoardInfo?: BoardHeaderDisplay;
  searchable?: boolean;
}

export function BoardHeader({
  boardID,
  initialBoardInfo,
  searchable = true,
}: BoardHeaderProps) {
  const { boardInfo, categoryDescription, goToBoardMain } = useBoardHeaderMeta(
    boardID,
    initialBoardInfo
  );

  // 모바일/데스크톱 전환 시에도 같은 검색어를 이어 쓴다(Responsive 한쪽만 마운트)
  const keyword = useBoardHeaderSearchKeyword();

  return (
    <Responsive
      mobile={
        <BoardHeaderMobile
          boardID={boardID}
          boardInfo={boardInfo}
          goToBoardMain={goToBoardMain}
          keyword={keyword}
          searchable={searchable}
        />
      }
      desktop={
        <BoardHeaderDesktop
          boardID={boardID}
          boardInfo={boardInfo}
          {...(categoryDescription !== undefined
            ? { categoryDescription }
            : {})}
          keyword={keyword}
          searchable={searchable}
        />
      }
    />
  );
}
