"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { Alert } from "@/shared";

import { QuestionItemEditBody } from "./QuestionItemEditBody";
import { QuestionItemEditFooter } from "./QuestionItemEditFooter";
import { QuestionItemEditHeader } from "./QuestionItemEditHeader";
import {
  buildQuestionTypeChangeUpdates,
  getQuestionOptionsOnTypeChange,
} from "../../../../lib/question-type";
import {
  PromotionDraftQuestion,
  PromotionQuestionKind,
} from "../../../../types";
import {
  type QuestionItemEditFormValues,
  questionItemEditSchema,
} from "../../../../types/schemas/question-edit.schema";

interface QuestionItemEditProps {
  question: PromotionDraftQuestion;
  questionIndex: number;
  totalQuestions: number;
  onBlur: () => void;
  isPersistedQuestion: boolean;
  updateQuestion: (
    clientTempId: string,
    updates: Partial<PromotionDraftQuestion>
  ) => void;
  moveQuestion: (clientTempId: string, direction: "up" | "down") => void;
  deleteQuestion: (clientTempId: string) => void;
}

export const QuestionItemEdit = ({
  question,
  questionIndex,
  totalQuestions,
  onBlur,
  isPersistedQuestion,
  updateQuestion,
  moveQuestion,
  deleteQuestion,
}: QuestionItemEditProps) => {
  const isFirstQuestion = questionIndex === 0;
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const { control, handleSubmit, setValue, watch, getValues, formState } =
    useForm<QuestionItemEditFormValues>({
      resolver: zodResolver(questionItemEditSchema),
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {
        questionType: question.questionType,
        label: question.label,
        required: question.required,
        options: question.options,
      },
    });
  const { fields, append, replace } = useFieldArray({
    control,
    name: "options",
  });
  const currentQuestionType = watch("questionType");
  const hasOptions = currentQuestionType !== "TEXT";

  const handleLocalTypeChange = (newType: PromotionQuestionKind) => {
    if (newType === currentQuestionType) {
      return;
    }

    const prevOptions = getValues("options");
    const nextOptions = getQuestionOptionsOnTypeChange(
      currentQuestionType,
      newType,
      prevOptions
    );
    setValue("questionType", newType, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    replace(nextOptions);
  };

  const handleAddOption = () => {
    append({
      label: "",
      orderNo: fields.length + 1,
    });
  };

  const handleRemoveOption = (optionIndex: number) => {
    const normalized = getValues("options")
      .filter((_, index) => index !== optionIndex)
      .map((option, index) => ({
        ...option,
        orderNo: index + 1,
      }));
    replace(normalized);
  };

  const handleSave = handleSubmit((values) => {
    const normalizedOptions = values.options.map((option, index) => ({
      ...option,
      orderNo: index + 1,
    }));
    const typeUpdates =
      values.questionType === question.questionType
        ? {}
        : buildQuestionTypeChangeUpdates(question, values.questionType);

    updateQuestion(question.clientTempId, {
      ...typeUpdates,
      questionType: values.questionType,
      label: values.label,
      required: values.required,
      options: values.questionType === "TEXT" ? [] : normalizedOptions,
    });
    onBlur();
  });

  const hasMeaningfulContent = () => {
    const values = getValues();
    const hasLabel = values.label.trim().length > 0;
    const hasOptionLabel = values.options.some(
      (option) => option.label.trim().length > 0
    );
    return hasLabel || hasOptionLabel;
  };

  const handleCancel = () => {
    if (!isPersistedQuestion) {
      onBlur();
      return;
    }

    if (!hasMeaningfulContent()) {
      deleteQuestion(question.clientTempId);
      return;
    }

    if (!formState.isDirty) {
      onBlur();
      return;
    }

    Alert.confirm({
      title: "질문 편집 취소",
      message: "저장하지 않은 변경사항이 사라집니다.",
      onConfirm: () => onBlur(),
      onCancel: () => {},
      confirmText: "취소하기",
      cancelText: "계속 수정",
      confirmColor: "red",
    });
  };

  return (
    <>
      <QuestionItemEditHeader
        questionType={currentQuestionType}
        isFirstQuestion={isFirstQuestion}
        isLastQuestion={isLastQuestion}
        actions={{
          onTypeChange: handleLocalTypeChange,
          onMoveUp: () => moveQuestion(question.clientTempId, "up"),
          onMoveDown: () => moveQuestion(question.clientTempId, "down"),
          onDelete: () => deleteQuestion(question.clientTempId),
        }}
      />

      <QuestionItemEditBody
        questionType={currentQuestionType}
        options={fields}
        hasOptions={hasOptions}
        control={control}
        errors={formState.errors}
        onAddOption={handleAddOption}
        onRemoveOption={handleRemoveOption}
      />

      <QuestionItemEditFooter
        control={control}
        onCancel={handleCancel}
        onSave={handleSave}
        isSaveDisabled={!formState.isValid || !formState.isDirty}
      />
    </>
  );
};
