"use client";

import { Input } from "@/shared";

import type {
  PromotionSurveyFieldValue,
  PromotionSurveyQuestion,
} from "../../../../types";

interface TextQuestionAnswerProps {
  question: PromotionSurveyQuestion & { questionType: "TEXT" };
  answer: string | undefined;
  setAnswerField: (id: number, value: Partial<PromotionSurveyFieldValue>) => void;
  showError?: boolean;
}

export const TextQuestionAnswer = ({
  question,
  answer,
  setAnswerField,
  showError = false,
}: TextQuestionAnswerProps) => {
  const { maxLength, placeholder } = question.settings;
  const textAnswer = answer ?? "";
  const isEmptyRequired = question.required && textAnswer.trim().length === 0;

  const handleTextChange = (value: string) => {
    setAnswerField(question.id, { answerText: value });
  };

  return (
    <div className="space-y-[8px] py-[8px]">
      <Input
        label=""
        name={`question-${question.id}`}
        type="text"
        placeholder={placeholder.trim().length > 0 ? placeholder : (question.required
          ? "답변을 입력해주세요 (필수)"
          : "답변을 입력해주세요")}
        value={textAnswer}
        onChange={(e) => handleTextChange(e.target.value)}
        maxLength={maxLength}
        className="w-full"
      />

      {showError && isEmptyRequired && (
        <div className="text-[12px] text-red-500">
          이 질문은 필수 응답 항목입니다.
        </div>
      )}
    </div>
  );
};
