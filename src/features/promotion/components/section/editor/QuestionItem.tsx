"use client";

import { cn } from "@/shared";

import { QuestionItemEdit } from "./QuestionItemEdit";
import { QuestionItemPreview } from "./QuestionItemPreview";
import { PromotionDraftQuestion } from "../../../types";

interface QuestionItemProps {
  question: PromotionDraftQuestion;
  questionIndex: number;
  totalQuestions: number;
  isEditing: boolean;
  onFocus: () => void;
  onBlur: () => void;
  isPersistedQuestion: boolean;
  updateQuestion: (
    clientTempId: string,
    updates: Partial<PromotionDraftQuestion>
  ) => void;
  deleteQuestion: (clientTempId: string) => void;
  moveQuestion: (clientTempId: string, direction: "up" | "down") => void;
}

export const QuestionItem = ({
  question,
  questionIndex,
  totalQuestions,
  isEditing,
  onFocus,
  onBlur,
  isPersistedQuestion,
  updateQuestion,
  deleteQuestion,
  moveQuestion,
}: QuestionItemProps) => {
  return (
    <div
      data-question-card
      className={cn(
        "w-full overflow-hidden rounded-lg bg-background transition-all duration-200",
        isEditing
          ? "box-border border-2 border-blue-400"
          : "border border-grey-300"
      )}
    >
      {isEditing ? (
        <QuestionItemEdit
          key={question.clientTempId}
          question={question}
          questionIndex={questionIndex}
          totalQuestions={totalQuestions}
          onBlur={onBlur}
          isPersistedQuestion={isPersistedQuestion}
          updateQuestion={updateQuestion}
          moveQuestion={moveQuestion}
          deleteQuestion={deleteQuestion}
        />
      ) : (
        <QuestionItemPreview
          question={question}
          questionIndex={questionIndex}
          onFocus={onFocus}
        />
      )}
    </div>
  );
};
