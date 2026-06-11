"use client";

import { PromotionDraftQuestion } from "../../../../types";
import { OptionsQuestionPreview } from "../../../ui/OptionsQuestionPreview";
import { TextQuestionPreview } from "../../../ui/TextQuestionPreview";

interface QuestionItemPreviewBodyProps {
  question: PromotionDraftQuestion;
  questionIndex: number;
}

export const QuestionItemPreviewBody = ({
  question,
  questionIndex,
}: QuestionItemPreviewBodyProps) => {
  const renderQuestionContent = () => {
    switch (question.questionType) {
      case "TEXT":
        return <TextQuestionPreview />;
      case "CHOICE":
        return (
          <OptionsQuestionPreview
            options={question.options}
            markerVariant="radio"
          />
        );
      case "CHECKBOX":
        return (
          <OptionsQuestionPreview
            options={question.options}
            markerVariant="checkbox"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="my-2">
      <div className="flex flex-col gap-[12px] space-y-[8px]">
        <div className="px-2 pt-2 text-[16px] font-medium text-grey-800">
          <span className="mr-1 text-[14px] font-medium text-grey-500">
            Q{questionIndex + 1}.
          </span>
          <span>{question.label || "질문을 입력해주세요."}</span>
          {question.required && <span className="ml-[4px] text-red-500">*</span>}
        </div>
        {renderQuestionContent()}
      </div>
    </div>
  );
};
