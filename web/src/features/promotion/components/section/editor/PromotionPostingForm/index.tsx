"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { FormProvider, useForm } from "react-hook-form";

import { PromotionPostingFormBody } from "./PromotionPostingFormBody";
import { mapFormDetailToDefaultValues } from "../../../../services/map-promotion-form-detail";
import { usePromotionQuestionDraftStore } from "../../../../store/question-draft.store";
import type { PromotionFormDraft } from "../../../../types";
import type { PromotionPostingFormValues } from "../../../../types/promotion-posting-form.types";

interface PromotionPostingFormProps {
  form: PromotionFormDraft;
}

export const PromotionPostingForm = ({ form }: PromotionPostingFormProps) => {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");

  // 폼 값은 마운트 시 서버 스냅샷으로만 시드
  // 재조회로 편집 중인 값을 덮어쓰지 않음
  const methods = useForm<PromotionPostingFormValues>({
    defaultValues: mapFormDetailToDefaultValues(form),
    mode: "onChange",
  });

  useEffect(() => {
    return () => usePromotionQuestionDraftStore.getState().reset();
  }, []);

  return (
    <FormProvider {...methods}>
      <PromotionPostingFormBody formId={formId} form={form} />
    </FormProvider>
  );
};
