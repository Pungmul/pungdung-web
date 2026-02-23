"use client";

import { useCallback, useState } from "react";

import { calculateStatistics, exportToExcel } from "../../services";
import type {
  PromotionApplicationDetail,
  PromotionPublishedQuestion,
  PromotionQuestionStatistics,
} from "../../types";

export interface UsePromotionFormResponsesExcelExportParams {
  responses: PromotionApplicationDetail[];
  questions: PromotionPublishedQuestion[];
  workbookTitle: string;
  /** 표시 영역에서 이미 계산한 통계가 있으면 내보내기 시 재계산을 피합니다. */
  statisticsForExport?: PromotionQuestionStatistics[];
}

/** 공연 응답 목록 엑셀 내보내기(진행 중 플래그 + 메시지 포함) — PromotionDetail 없이 제목·질문 목록만으로 동작합니다. */
export function usePromotionFormResponsesExcelExport({
  responses,
  questions,
  workbookTitle,
  statisticsForExport,
}: UsePromotionFormResponsesExcelExportParams) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      const statistics =
        statisticsForExport ?? calculateStatistics(responses, questions);
      await exportToExcel(responses, statistics, {
        title: workbookTitle,
        questions,
      });
    } catch (error) {
      console.error("엑셀 내보내기 실패:", error);
      alert("엑셀 내보내기에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsExporting(false);
    }
  }, [questions, responses, statisticsForExport, workbookTitle]);

  return { isExporting, handleExport };
}
