"use client";

import { useFormContext, useWatch } from "react-hook-form";

import {
  LIGHTNING_CREATE_FORM_FIELD,
  LIGHTNING_CREATE_STEP_FIELD,
} from "../../constants";
import { useLightningBuildContext } from "../../providers";
import type { LightningCreateFormData } from "../../types/schemas";

const FIELDS = LIGHTNING_CREATE_FORM_FIELD;
const STEP_FIELDS = LIGHTNING_CREATE_STEP_FIELD.SELECT_TYPE;

export const useSelectTypeStepForm = () => {
  const form = useFormContext<LightningCreateFormData>();
  const { setBuildStep } = useLightningBuildContext();
  const lightningType = useWatch({ control: form.control, name: FIELDS.LIGHTNING_TYPE });

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
    if (isValid) {
      setBuildStep("SelectLocation");
    }
  };

  return {
    lightningType,
    selectLightningType,
    submitSelectTypeStep,
  };
};
