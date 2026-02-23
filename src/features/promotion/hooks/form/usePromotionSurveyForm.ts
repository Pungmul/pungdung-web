"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { BaseSyntheticEvent } from "react";
import type { SubmitHandler } from "react-hook-form";

import { Toast } from "@/shared";

import { normalizePromotionSurveyQuestions } from "../../services/normalize-promotion-survey-questions";
import type {
  PromotionPublishedQuestion,
  PromotionSurveyFieldValue,
  PromotionSurveyQuestion,
} from "../../types";
import {
  createPromotionSurveyFormValuesSchema,
  type PromotionSurveyFormValues,
} from "../../types/schemas/promotion-survey-question.schema";

function buildEmptyAnswers(
  questionIds: number[]
): PromotionSurveyFormValues["answers"] {
  return Object.fromEntries(
    questionIds.map((id) => [
      String(id),
      { answerText: null, selectedOptionIds: [] as number[] },
    ])
  );
}

interface UsePromotionSurveyFormParams {
  questions: PromotionPublishedQuestion[];
  onSubmit: (answers: Record<string, PromotionSurveyFieldValue>) => void;
}

export interface PromotionSurveySubmitState {
  isSubmitting: boolean;
  canContinue: boolean;
  requiredCount: number;
  /** 화면 순서 기준 1-based (Q1, Q2 …) */
  requiredDisplayNumbers: number[];
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
}

/** 설문 응답: 정규화된 문항 + RHF + zod 동적 검증 */
export function usePromotionSurveyForm({
  questions,
  onSubmit,
}: UsePromotionSurveyFormParams) {
  const formConfig = useMemo(() => {
    const normalized = normalizePromotionSurveyQuestions(questions);
    const normalizedQuestions: PromotionSurveyQuestion[] = normalized.ok
      ? normalized.data
      : [];

    return {
      normalized,
      normalizedQuestions,
      schema: createPromotionSurveyFormValuesSchema(normalizedQuestions),
      defaultValues: normalized.ok
        ? { answers: buildEmptyAnswers(normalized.data.map((q) => q.id)) }
        : { answers: {} },
    };
  }, [questions]);

  const form = useForm<PromotionSurveyFormValues>({
    resolver: zodResolver(formConfig.schema),
    defaultValues: formConfig.defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { reset, handleSubmit, formState, trigger } = form;

  useEffect(() => {
    if (!formConfig.normalized.ok) {
      reset({ answers: {} });
      return;
    }
    reset({
      answers: buildEmptyAnswers(formConfig.normalized.data.map((q) => q.id)),
    });
  }, [formConfig, reset]);

  useEffect(() => {
    void trigger();
  }, [formConfig.schema, trigger]);

  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredCount = formConfig.normalized.ok
    ? formConfig.normalized.data.filter((q) => q.required).length
    : 0;

  const requiredDisplayNumbers = useMemo(
    () =>
      formConfig.normalizedQuestions
        .map((q, i) => (q.required ? i + 1 : null))
        .filter((n): n is number => n !== null),
    [formConfig.normalizedQuestions]
  );

  const canContinue = formState.isValid;

  const submitValidated = useCallback<SubmitHandler<PromotionSurveyFormValues>>(
    (values) => {
      const record: Record<string, PromotionSurveyFieldValue> = {};
      for (const [k, v] of Object.entries(values.answers)) {
        record[k] = {
          answerText: v.answerText ?? null,
          selectedOptionIds: v.selectedOptionIds ?? [],
        };
      }
      setIsSubmitting(true);
      try {
        onSubmit(record);
        Toast.show({
          message: "설문이 성공적으로 제출되었습니다!",
          type: "success",
          duration: 3000,
        });
      } catch (error) {
        console.error("설문 제출 오류:", error);
        Toast.show({
          message: "설문 제출 중 오류가 발생했습니다.",
          type: "error",
          duration: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
  );

  const onFormSubmit = useMemo(
    () =>
      handleSubmit(submitValidated, () => {
        setShowErrors(true);
      }),
    [handleSubmit, submitValidated]
  );

  const submit = useMemo(
    () => ({
      isSubmitting,
      canContinue,
      requiredCount,
      requiredDisplayNumbers,
      onSubmit: onFormSubmit,
    }),
    [canContinue, isSubmitting, onFormSubmit, requiredCount, requiredDisplayNumbers]
  );

  const isInvalid = !formConfig.normalized.ok;

  return {
    form,
    normalizedQuestions: formConfig.normalizedQuestions,
    isInvalid,
    showErrors,
    submit,
  };
}
