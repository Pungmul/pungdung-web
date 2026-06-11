"use client";
import { type Control,Controller } from "react-hook-form";

import { Input } from "@/shared";

import { QuestionItemEditFormValues } from "../../../../../types/schemas/question-edit.schema";

interface TextQuestionFormProps {
  control: Control<QuestionItemEditFormValues>;
}

export const TextQuestionForm = ({
  control,
}: TextQuestionFormProps) => {
  return (
    <Controller
      control={control}
      name="label"
      render={({ field, fieldState }) => (
      <Input
        label="질문"
        placeholder="질문을 입력해주세요."
        className="w-full"
        type="text"
        value={field.value}
        onChange={(e) => field.onChange(e.target.value)}
        errorMessage={fieldState.error?.message}
      />
      )}
    />
  );
};
