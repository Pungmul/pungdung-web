"use client";

import { QuestionAddButton } from "./QuestionAddButton";
import { usePromotionPostingQuestions } from "../../../../hooks/form/usePromotionPostingQuestions";
import { usePromotionQuestionFocusGuard } from "../../../../hooks/form/usePromotionQuestionFocusGuard";
import { QuestionItem } from "../QuestionItem";

export const QuestionContentSection = () => {
  const {
    mergedQuestions,
    persistedQuestionIds,
    focusedQuestionId,
    addQuestionDraft,
    updateQuestion,
    deleteQuestion,
    moveQuestion,
    setFocusedQuestionId,
    blurQuestionRow,
  } = usePromotionPostingQuestions();

  const { handleFocusQuestion } = usePromotionQuestionFocusGuard({
    focusedQuestionId,
    setFocusedQuestionId,
    blurQuestionRow,
  });

  return (
    <section className="w-full flex flex-col gap-[12px]">
      <main className="w-full flex flex-col gap-[12px]">
        {mergedQuestions.map((question, index) => (
          <QuestionItem
            key={question.clientTempId}
            question={question}
            questionIndex={index}
            totalQuestions={mergedQuestions.length}
            isEditing={focusedQuestionId === question.clientTempId}
            onFocus={() => handleFocusQuestion(question.clientTempId)}
            onBlur={() => blurQuestionRow(question.clientTempId)}
            isPersistedQuestion={persistedQuestionIds.has(question.clientTempId)}
            updateQuestion={updateQuestion}
            deleteQuestion={deleteQuestion}
            moveQuestion={moveQuestion}
          />
        ))}
      </main>
      <QuestionAddButton onSelectQuestionType={addQuestionDraft} />
    </section>
  );
};
