"use client";

import { PencilIcon } from "@heroicons/react/24/outline";

import { getQuestionTypeLabel } from "../../../../lib/question-type";
import { PromotionDraftQuestion } from "../../../../types";

interface QuestionItemPreviewHeaderProps {
  question: PromotionDraftQuestion;
  onFocus: () => void;
}

export const QuestionItemPreviewHeader = ({
  question,
  onFocus,
}: QuestionItemPreviewHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-start gap-1 px-1">
      <span className="rounded bg-grey-100 px-2 py-1 text-xs font-medium text-grey-500">
        {getQuestionTypeLabel(question.questionType)}
      </span>
      <div
        title="수정"
        data-question-item-edit-button
        className="ml-auto flex size-7 cursor-pointer items-center justify-center rounded p-1 hover:bg-grey-100"
        onClick={(e) => {
          e.stopPropagation();
          onFocus();
        }}
      >
        <span className="size-full flex items-center justify-center">
          <PencilIcon className="size-full rounded text-grey-500" />
        </span>
      </div>
    </div>
  );
};
