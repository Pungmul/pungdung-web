"use client";

import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
} from "react-hook-form";

import { CheckboxQuestionAnswer } from "./CheckboxQuestionAnswer";
import { ChoiceQuestionAnswer } from "./ChoiceQuestionAnswer";
import { TextQuestionAnswer } from "./TextQuestionAnswer";
import type {
  PromotionSurveyFieldValue,
  PromotionSurveyFormValues,
  PromotionSurveyQuestion,
} from "../../../../types";

type SurveyAnswerFieldValue =
  PromotionSurveyFormValues["answers"][string];

type SurveyAnswerField = ControllerRenderProps<
  PromotionSurveyFormValues,
  FieldPath<PromotionSurveyFormValues>
>;

interface QuestionAnswerProps {
  question: PromotionSurveyQuestion;
  questionIndex: number;
  field: SurveyAnswerField;
  fieldState: ControllerFieldState;
  showError?: boolean;
}

export const QuestionAnswer = ({
  question,
  questionIndex,
  field,
  fieldState,
  showError = false,
}: QuestionAnswerProps) => {
  const value = field.value as SurveyAnswerFieldValue | undefined;

  const setAnswerField = (
    _questionId: number,
    patch: Partial<PromotionSurveyFieldValue>
  ) => {
    const prev = value ?? {
      answerText: null,
      selectedOptionIds: [] as number[],
    };
    field.onChange({
      answerText:
        patch.answerText !== undefined
          ? patch.answerText
          : prev.answerText ?? null,
      selectedOptionIds:
        patch.selectedOptionIds !== undefined
          ? patch.selectedOptionIds
          : prev.selectedOptionIds ?? [],
    });
  };

  const answer: PromotionSurveyFieldValue = {
    answerText: value?.answerText ?? null,
    selectedOptionIds: value?.selectedOptionIds ?? [],
  };

  const renderAnswerInput = () => {
    switch (question.questionType) {
      case "TEXT":
        return (
          <TextQuestionAnswer
            question={question}
            answer={answer.answerText ?? ""}
            setAnswerField={setAnswerField}
            showError={showError}
          />
        );

      case "CHOICE":
        return (
          <ChoiceQuestionAnswer
            question={question}
            answer={answer.selectedOptionIds?.[0]}
            setAnswerField={setAnswerField}
            showError={showError}
          />
        );

      case "CHECKBOX":
        return (
          <CheckboxQuestionAnswer
            question={question}
            answer={answer.selectedOptionIds ?? []}
            setAnswerField={setAnswerField}
            showError={showError}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-[12px] w-full p-[16px] border border-grey-300 rounded-lg bg-background">
      <div className="text-[16px] font-medium text-grey-800">
        <span className="text-[14px] font-medium text-grey-600 mr-[8px]">
          Q{questionIndex + 1}.
        </span>
        <span>{question.label}</span>
        {question.required && <span className="text-red-500 ml-[4px]">*</span>}
      </div>

      {renderAnswerInput()}

      {showError && fieldState.error?.message ? (
        <p className="text-[12px] text-red-500 mt-[4px]">
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  );
};
