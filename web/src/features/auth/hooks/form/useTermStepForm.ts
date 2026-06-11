"use client";

import { useMemo } from "react";

import { useFormContext, useWatch } from "react-hook-form";

import { SIGN_UP_FORM_FIELD } from "../../constants";
import {
  termsAgreementSchema,
  type TermsStepFormData,
} from "../../types/schemas";

const TERMS_FIELDS = SIGN_UP_FORM_FIELD.TERMS;

export function useTermStepForm() {
  const form = useFormContext<TermsStepFormData>();
  const termsValues = useWatch({
    control: form.control,
    name: [TERMS_FIELDS.USING_TERM, TERMS_FIELDS.PERSONAL_INFO],
  });

  const isAllChecked = useMemo(() => {
    const [usingTermAgree, personalInfoAgree] = termsValues;

    return termsAgreementSchema.safeParse({
      usingTermAgree,
      personalInfoAgree,
    }).success;
  }, [termsValues]);

  const handleAllCheck = (checked: boolean) => {
    form.setValue(TERMS_FIELDS.USING_TERM, checked, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue(TERMS_FIELDS.PERSONAL_INFO, checked, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const submitTermsStep = async (
    onValid: (data: TermsStepFormData) => void
  ) => {
    const isValid = await form.trigger([
      TERMS_FIELDS.USING_TERM,
      TERMS_FIELDS.PERSONAL_INFO,
    ]);
    if (!isValid) {
      return;
    }

    onValid({
      usingTermAgree: form.getValues(TERMS_FIELDS.USING_TERM),
      personalInfoAgree: form.getValues(TERMS_FIELDS.PERSONAL_INFO),
    });
  };

  return {
    control: form.control,
    isAllChecked,
    handleAllCheck,
    submitTermsStep,
  };
}
