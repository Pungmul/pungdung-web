"use client";
import { useMemo } from "react";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

import { QuestionStatisticsItem } from "./QuestionStatisticsItem";
import { usePromotionFormResponsesExcelExport } from "../../../hooks/actions";
import { calculateStatistics } from "../../../services";
import { PromotionApplicationDetail, PromotionDetail } from "../../../types";

interface StatisticsTabProps {
  responses: PromotionApplicationDetail[];
  promotionDetail: PromotionDetail;
}

export function StatisticsTab({
  responses,
  promotionDetail,
}: StatisticsTabProps) {
  const { title, questions } = promotionDetail;

  const statistics = useMemo(
    () => calculateStatistics(responses, questions),
    [responses, questions]
  );

  const { isExporting, handleExport } = usePromotionFormResponsesExcelExport({
    responses,
    questions,
    workbookTitle: title,
    statisticsForExport: statistics,
  });

  return (
    <div className="w-full flex flex-col gap-[16px] px-[24px]">
      <div className="flex flex-row items-center justify-between">
        <div className="font-semibold text-grey-600 text-[16px] lg:text-[18px]">
          질문별 통계 ({statistics.length}개)
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting || responses.length === 0}
          className="flex flex-row items-center gap-[8px] px-[16px] py-[8px] bg-primary text-background rounded-[8px] text-[14px] font-medium disabled:bg-grey-300 disabled:cursor-not-allowed hover:bg-primary-light transition-colors"
        >
          <span className="size-6 flex items-center justify-center">
            <ArrowDownTrayIcon className="size-full" />
          </span>
          {isExporting ? "내보내는 중..." : "엑셀 다운로드"}
        </button>
      </div>
      <div className="flex flex-col gap-[16px]">
        {statistics
          .sort((a, b) => a.orderNo - b.orderNo)
          .map((stat) => (
            <QuestionStatisticsItem key={stat.questionId} statistics={stat} />
          ))}
        {statistics.length === 0 && (
          <div className="flex items-center justify-center py-[48px] text-grey-400 text-[14px]">
            통계 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

