import type {
  PromotionApplicationDetail,
  PromotionPublishedQuestion,
  PromotionQuestionOptionStatistic,
  PromotionQuestionStatistics,
} from "../types";

/**
 * 응답 데이터와 질문 데이터를 기반으로 통계를 계산합니다.
 */
export function calculateStatistics(
  responses: PromotionApplicationDetail[],
  questions: PromotionPublishedQuestion[]
): PromotionQuestionStatistics[] {
  return questions.map((question) => {
    const questionAnswers = responses.flatMap((response) =>
      response.answerList.filter((answer) => answer.questionId === question.id)
    );

    if (question.questionType === "TEXT") {
      return {
        questionId: question.id,
        questionLabel: question.label,
        required: question.required,
        questionType: "TEXT",
        orderNo: question.orderNo,
        textAnswers: questionAnswers
          .map((a) => a.answerText || "")
          .filter((text) => text.trim() !== ""),
        optionStatistics: [],
        totalResponses: questionAnswers.length,
      };
    } else {
      // CHOICE, CHECKBOX 처리
      const optionCounts = new Map<number, number>();

      // 모든 옵션을 0으로 초기화
      question.options.forEach((option) => {
        optionCounts.set(option.id, 0);
      });

      // 응답별로 선택된 옵션 카운트
      questionAnswers.forEach((answer) => {
        answer.selectedOptions?.forEach((option) => {
          const currentCount = optionCounts.get(option.id) || 0;
          optionCounts.set(option.id, currentCount + 1);
        });
      });

      const total = questionAnswers.length;
      const optionStatistics: PromotionQuestionOptionStatistic[] = Array.from(
        optionCounts.entries()
      ).map(([optionId, count]) => {
        const option = question.options.find((o) => o.id === optionId);
        return {
          optionId,
          optionLabel: option?.label || "",
          count,
          percentage: total > 0 ? Math.round((count / total) * 100 * 10) / 10 : 0,
        };
      });

      return {
        questionId: question.id,
        questionLabel: question.label,
        questionType: question.questionType,
        orderNo: question.orderNo,
        required: question.required,
        textAnswers: [],
        optionStatistics,
        totalResponses: total,
      };
    }
  });
}
