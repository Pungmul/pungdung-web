"use client";

import { QuestionItemEditActionButtons } from "./QuestionItemEditActionButtons";
import { QuestionItemEditTypeDropdown } from "./QuestionItemEditTypeDropdown";
import type { PromotionQuestionKind } from "../../../../../types";

interface QuestionItemEditHeaderActions {
  onTypeChange: (newType: PromotionQuestionKind) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

interface QuestionItemEditHeaderProps {
  questionType: PromotionQuestionKind;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  actions: QuestionItemEditHeaderActions;
}

export const QuestionItemEditHeader = ({
  questionType,
  isFirstQuestion,
  isLastQuestion,
  actions,
}: QuestionItemEditHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-grey-200 bg-grey-100 px-3 py-2">
      <QuestionItemEditTypeDropdown
        questionType={questionType}
        onTypeChange={actions.onTypeChange}
      />

      <QuestionItemEditActionButtons
        isFirstQuestion={isFirstQuestion}
        isLastQuestion={isLastQuestion}
        onMoveUp={actions.onMoveUp}
        onMoveDown={actions.onMoveDown}
        onDelete={actions.onDelete}
      />
    </div>
  );
};
