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

  const methods = useForm<PromotionPostingFormValues>({
    defaultValues: mapFormDetailToDefaultValues(form),
    mode: "onChange",
  });

  useEffect(() => {
    methods.reset(mapFormDetailToDefaultValues(form));
    usePromotionQuestionDraftStore.getState().reset();
  }, [form, methods]);

  return (
    <FormProvider {...methods}>
      <PromotionPostingFormBody formId={formId} form={form} />
    </FormProvider>
  );
};
