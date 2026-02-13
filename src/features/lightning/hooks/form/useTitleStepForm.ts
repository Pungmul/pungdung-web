"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { useGetMyPageInfo } from "@/features/my-page";

import { LIGHTNING_CREATE_FORM_FIELD } from "../../constants";
import { useLightningBuildContext } from "../../providers";
import type { LightningCreateFormData } from "../../types/schemas";

const FIELDS = LIGHTNING_CREATE_FORM_FIELD;

export const useTitleStepForm = () => {
  const { data: user } = useGetMyPageInfo();
  const form = useFormContext<LightningCreateFormData>();
  const { setBuildStep } = useLightningBuildContext();
  const title = useWatch({ control: form.control, name: FIELDS.TITLE });
  const defaultTitle = `${user?.clubName ?? "내"}님의 모임`;

  const normalizeTitle = () => {
    const currentTitle = form.getValues(FIELDS.TITLE);
    const normalizedTitle = currentTitle?.trim() || defaultTitle;

    if (normalizedTitle !== currentTitle) {
      form.setValue(FIELDS.TITLE, normalizedTitle, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    return normalizedTitle;
  };

  const updateTitle = (nextTitle: string) => {
    form.setValue(FIELDS.TITLE, nextTitle, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const submitTitleStep = async () => {
    normalizeTitle();

    const isValid = await form.trigger();
    if (isValid) {
      setBuildStep("Complete");
    }
  };

  return {
    defaultTitle,
    submitTitleStep,
    title,
    updateTitle,
  };
};
