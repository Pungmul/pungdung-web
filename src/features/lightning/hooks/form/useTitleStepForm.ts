"use client";

import { useMemo, useState } from "react";

import { useFormContext, useWatch } from "react-hook-form";

import { useGetMyPageInfo } from "@/features/my-page";

import { LIGHTNING_CREATE_FORM_FIELD } from "../../constants";
import { useLightningBuildContext } from "../../providers";
import { zodIssuesToStepFieldMessages } from "../../services";
import {
  lightningSummaryTitleStepSchema,
  type LightningCreateFormData,
} from "../../types/schemas";

const FIELDS = LIGHTNING_CREATE_FORM_FIELD;
const TITLE_STEP_FIELDS = [FIELDS.TITLE] as const;

export const useTitleStepForm = () => {
  const { data: user } = useGetMyPageInfo();
  const form = useFormContext<LightningCreateFormData>();
  const { setBuildStep } = useLightningBuildContext();
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const title = useWatch({ control: form.control, name: FIELDS.TITLE });
  const defaultTitle = `${user?.clubName ?? "내"}님의 모임`;

  const parsedStep = useMemo(() => {
    const result = lightningSummaryTitleStepSchema.safeParse({
      [FIELDS.TITLE]: title ?? "",
    });

    if (result.success) {
      return {
        fieldErrors: {} as Partial<
          Record<(typeof TITLE_STEP_FIELDS)[number], string>
        >,
        isStepValueValid: true,
      };
    }

    return {
      fieldErrors: zodIssuesToStepFieldMessages(result.error, [
        ...TITLE_STEP_FIELDS,
      ]),
      isStepValueValid: false,
    };
  }, [title]);

  const fieldErrors = showValidationErrors ? parsedStep.fieldErrors : {};
  const isNextDisabled = showValidationErrors && !parsedStep.isStepValueValid;

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
    if (!isValid) {
      setShowValidationErrors(true);
      return;
    }
    setBuildStep("Complete");
  };

  return {
    defaultTitle,
    fieldErrors,
    isNextDisabled,
    submitTitleStep,
    title,
    updateTitle,
  };
};
