"use client";

import { useMemo, useState } from "react";

import { useFormContext, useWatch } from "react-hook-form";

import {
  LIGHTNING_CREATE_FORM_FIELD,
  LIGHTNING_CREATE_STEP_FIELD,
} from "../../constants";
import { useLightningBuildContext } from "../../providers";
import { zodIssuesToStepFieldMessages } from "../../services";
import {
  type LightningCreateFormData,
  lightningSelectTypeStepSchema,
} from "../../types/schemas";

const FIELDS = LIGHTNING_CREATE_FORM_FIELD;
const STEP_FIELDS = LIGHTNING_CREATE_STEP_FIELD.SELECT_TYPE;

export const useSelectTypeStepForm = () => {
  const form = useFormContext<LightningCreateFormData>();
  const { setBuildStep } = useLightningBuildContext();
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const lightningType = useWatch({
    control: form.control,
    name: FIELDS.LIGHTNING_TYPE,
  });

  const parsedStep = useMemo(() => {
    const result = lightningSelectTypeStepSchema.safeParse({
      [FIELDS.LIGHTNING_TYPE]: lightningType,
    });

    if (result.success) {
      return {
        fieldErrors: {} as Partial<Record<(typeof STEP_FIELDS)[number], string>>,
        isStepValueValid: true,
      };
    }

    return {
      fieldErrors: zodIssuesToStepFieldMessages(result.error, [...STEP_FIELDS]),
      isStepValueValid: false,
    };
  }, [lightningType]);

  const fieldErrors = showValidationErrors ? parsedStep.fieldErrors : {};
  const isNextDisabled =
    showValidationErrors && !parsedStep.isStepValueValid;

  const selectLightningType = (
    nextLightningType: LightningCreateFormData["lightningType"]
  ) => {
    form.setValue(FIELDS.LIGHTNING_TYPE, nextLightningType, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const submitSelectTypeStep = async () => {
    const isValid = await form.trigger([...STEP_FIELDS]);
    if (!isValid) {
      setShowValidationErrors(true);
      return;
    }
    setBuildStep("SelectLocation");
  };

  return {
    fieldErrors,
    isNextDisabled,
    lightningType,
    selectLightningType,
    submitSelectTypeStep,
  };
};
