"use client";

import { useRouter } from "next/navigation";

import { useBoardHeaderInfo } from "./useBoardHeaderInfo";
import type { BoardHeaderDisplay } from "../../types";

/** 게시판 헤더의 제목과 게시판 메인 이동을 제공한다. */
export function useBoardHeaderMeta(
  boardID: string,
  initialBoardInfo?: BoardHeaderDisplay
) {
  const router = useRouter();
  const boardInfo = useBoardHeaderInfo(boardID, initialBoardInfo);

  const goToBoardMain = () => {
    router.replace("/board/main", { scroll: false });
  };

  return { boardInfo, goToBoardMain };
}
