"use client";

import { type Control, type FieldErrors } from "react-hook-form";

import { CheckboxQuestionForm } from "./CheckboxQuestionForm";
import { ChoiceQuestionForm } from "./ChoiceQuestionForm";
import { TextQuestionForm } from "./TextQuestionForm";
import type { PromotionQuestionKind } from "../../../../../types";
import { QuestionItemEditFormValues } from "../../../../../types/schemas/question-edit.schema";

interface QuestionItemEditBodyProps {
  questionType: PromotionQuestionKind;
  options: Array<{ id: string; label: string; orderNo: number }>;
  hasOptions: boolean;
  control: Control<QuestionItemEditFormValues>;
  errors: FieldErrors<QuestionItemEditFormValues>;
  onAddOption: () => void;
  onRemoveOption: (optionIndex: number) => void;
}

export const QuestionItemEditBody = ({
  questionType,
  options,
  hasOptions,
  control,
  errors,
  onAddOption,
  onRemoveOption,
}: QuestionItemEditBodyProps) => {
  const renderQuestionContent = () => {
    switch (questionType) {
      case "TEXT":
        return <TextQuestionForm control={control} />;
      case "CHOICE":
        return (
          <ChoiceQuestionForm
            options={options}
            hasOptions={hasOptions}
            control={control}
            errors={errors}
            onAddOption={onAddOption}
            onRemoveOption={onRemoveOption}
          />
        );
      case "CHECKBOX":
        return (
          <CheckboxQuestionForm
            options={options}
            hasOptions={hasOptions}
            control={control}
            errors={errors}
            onAddOption={onAddOption}
            onRemoveOption={onRemoveOption}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-3">
      <div className="my-2">{renderQuestionContent()}</div>
    </div>
  );
};
