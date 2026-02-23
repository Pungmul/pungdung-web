"use client";
import dynamic from "next/dynamic";

import { PromotionQuestionStatistics } from "../../../types";
import { QuestionTypeBadge } from "../../ui/QuestionTypeBadge";

interface QuestionStatisticsItemProps {
  statistics: PromotionQuestionStatistics;
}

const QuestionStatisticsCharts = dynamic(
  () =>
    import("./QuestionStatisticsCharts").then((mod) => ({
      default: mod.QuestionStatisticsCharts,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[300px] w-full items-center justify-center text-grey-400 text-[14px]">
        차트 불러오는 중…
      </div>
    ),
  }
);

export function QuestionStatisticsItem({
  statistics,
}: QuestionStatisticsItemProps) {
  if (statistics.questionType === "TEXT") {
    return (
      <div className="flex flex-col gap-[16px] p-[16px] border border-grey-200 rounded-[8px] bg-background">
        <div className="flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[6px]">
            <div className="flex flex-row items-center gap-[4px]">
              <h3 className="font-semibold text-grey-800 text-[16px] lg:text-[18px]">
                Q{statistics.orderNo}. {statistics.questionLabel}
              </h3>
              {statistics.required && (
                <span className="text-red-500 text-[14px]">*</span>
              )}
            </div>
            <QuestionTypeBadge questionType={statistics.questionType} />
          </div>
          <div className="text-grey-500 text-[14px]">
            총 {statistics.totalResponses}명 응답
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          {statistics.textAnswers.length > 0 ? (
            statistics.textAnswers.map((text, index) => (
              <div
                key={index}
                className="p-[12px] bg-grey-50 rounded-[6px] text-grey-800 text-[14px]"
              >
                {text}
              </div>
            ))
          ) : (
            <div className="text-grey-400 text-[14px] py-[12px]">
              답변이 없습니다.
            </div>
          )}
        </div>
      </div>
    );
  }

  // CHOICE, CHECKBOX 타입
  const chartData = statistics.optionStatistics.map((opt) => ({
    name: opt.optionLabel,
    value: opt.count,
    percentage: opt.percentage,
  }));

  return (
    <div className="flex flex-col gap-[16px] p-[16px] border border-grey-200 rounded-[8px] bg-background">
      <div className="flex flex-col gap-[8px]">
        <div className="flex flex-col gap-[6px]">
          <div className="flex flex-row items-center gap-[4px]">
            <h3 className="font-semibold text-grey-800 text-[16px] lg:text-[18px]">
              Q{statistics.orderNo}. {statistics.questionLabel}
            </h3>
            {statistics.required && (
              <span className="text-red-500 text-[14px]">*</span>
            )}
          </div>
          <QuestionTypeBadge questionType={statistics.questionType} />
        </div>
        <div className="text-grey-500 text-[14px]">
          총 {statistics.totalResponses}명 응답
        </div>
      </div>

      {statistics.totalResponses > 0 ? (
        <div className="flex flex-col gap-[16px]">
          <QuestionStatisticsCharts
            questionType={statistics.questionType}
            chartData={chartData}
          />

          {/* 통계 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-grey-50">
                  <th className="border border-grey-200 px-[12px] py-[8px] text-left text-[14px] font-semibold text-grey-700">
                    옵션
                  </th>
                  <th className="border border-grey-200 px-[12px] py-[8px] text-center text-[14px] font-semibold text-grey-700">
                    응답 수
                  </th>
                  <th className="border border-grey-200 px-[12px] py-[8px] text-center text-[14px] font-semibold text-grey-700">
                    비율
                  </th>
                </tr>
              </thead>
              <tbody>
                {statistics.optionStatistics.map((opt) => (
                  <tr key={opt.optionId}>
                    <td className="border border-grey-200 px-[12px] py-[8px] text-[14px] text-grey-800">
                      {opt.optionLabel}
                    </td>
                    <td className="border border-grey-200 px-[12px] py-[8px] text-[14px] text-grey-800 text-center">
                      {opt.count}명
                    </td>
                    <td className="border border-grey-200 px-[12px] py-[8px] text-[14px] text-grey-800 text-center">
                      {opt.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-grey-400 text-[14px] py-[12px]">
          응답이 없습니다.
        </div>
      )}
    </div>
  );
}
