"use client";
import { QuestionItemPreviewBody } from "./QuestionItemPreviewBody";
import { QuestionItemPreviewHeader } from "./QuestionItemPreviewHeader";
import { PromotionDraftQuestion } from "../../../../types";

interface QuestionPreviewProps {
  question: PromotionDraftQuestion;
  questionIndex: number;
  onFocus: () => void;
}

export const QuestionItemPreview = ({
  question,
  questionIndex,
  onFocus,
}: QuestionPreviewProps) => {
  return (
    <div className="p-3">
      <QuestionItemPreviewHeader question={question} onFocus={onFocus} />
      <QuestionItemPreviewBody question={question} questionIndex={questionIndex} />
    </div>
  );
};
