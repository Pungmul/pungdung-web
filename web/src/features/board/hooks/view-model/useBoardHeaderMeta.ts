"use client";

import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { useBoardHeaderInfo } from "./useBoardHeaderInfo";
import { BOARD_HEADER_SYNTHETIC_BY_SEGMENT } from "../../constants";
import { boardQueries } from "../../queries";
import type { BoardCategoryPath, BoardHeaderDisplay } from "../../types";

function formatCategoryDescription(path: BoardCategoryPath): string {
  const root = path.rootCategoryName.trim();
  const child = path.childCategoryName?.trim() ?? "";
  if (root && child) return `${root} › ${child}`;
  if (root) return root;
  if (child) return child;
  return "";
}

/** 헤더 렌더용: 게시판 제목·설명 + 게시판 메인으로 나가기. */
export function useBoardHeaderMeta(
  boardID: string,
  initialBoardInfo?: BoardHeaderDisplay
) {
  const router = useRouter();
  const boardInfo = useBoardHeaderInfo(boardID, initialBoardInfo);

  const numericBoardId = Number(boardID);
  const shouldLoadBoardCategory =
    Number.isInteger(numericBoardId) &&
    numericBoardId > 0 &&
    !BOARD_HEADER_SYNTHETIC_BY_SEGMENT[boardID];

  const { data: categoryPath } = useQuery({
    ...boardQueries.boardInfo(numericBoardId),
    enabled: shouldLoadBoardCategory,
  });

  const formattedCategory =
    categoryPath !== undefined
      ? formatCategoryDescription(categoryPath.boardInfo)
      : "";

  const categoryDescription =
    formattedCategory.trim().length > 0 ? formattedCategory : undefined;

  const goToBoardMain = () => {
    router.replace("/board/main", { scroll: false });
  };

  return { boardInfo, categoryDescription, goToBoardMain };
}
