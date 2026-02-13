"use client";

import { useFormContext, useWatch } from "react-hook-form";

import {
  LIGHTNING_CREATE_FORM_FIELD,
  LIGHTNING_CREATE_STEP_FIELD,
} from "../../constants";
import { useLightningBuildContext } from "../../providers";
import type { LightningCreateFormData } from "../../types/schemas";

const FIELDS = LIGHTNING_CREATE_FORM_FIELD;
const STEP_FIELDS = LIGHTNING_CREATE_STEP_FIELD.SELECT_TARGET;

export const useSelectTargetStepForm = () => {
  const form = useFormContext<LightningCreateFormData>();
  const { setBuildStep } = useLightningBuildContext();
  const target = useWatch({ control: form.control, name: FIELDS.TARGET });

  const selectTarget = (nextTarget: LightningCreateFormData["target"]) => {
    form.setValue(FIELDS.TARGET, nextTarget, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const submitSelectTargetStep = async () => {
    const isValid = await form.trigger([...STEP_FIELDS]);
    if (isValid) {
      setBuildStep("Summary");
    }
  };

  return {
    selectTarget,
    submitSelectTargetStep,
    target,
  };
};
