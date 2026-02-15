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
  lightningSelectTargetStepSchema,
  type LightningCreateFormData,
} from "../../types/schemas";

const FIELDS = LIGHTNING_CREATE_FORM_FIELD;
const STEP_FIELDS = LIGHTNING_CREATE_STEP_FIELD.SELECT_TARGET;

export const useSelectTargetStepForm = () => {
  const form = useFormContext<LightningCreateFormData>();
  const { setBuildStep } = useLightningBuildContext();
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const target = useWatch({ control: form.control, name: FIELDS.TARGET });

  const parsedStep = useMemo(() => {
    const result = lightningSelectTargetStepSchema.safeParse({
      [FIELDS.TARGET]: target,
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
  }, [target]);

  const fieldErrors = showValidationErrors ? parsedStep.fieldErrors : {};
  const isNextDisabled =
    showValidationErrors && !parsedStep.isStepValueValid;

  const selectTarget = (nextTarget: LightningCreateFormData["target"]) => {
    form.setValue(FIELDS.TARGET, nextTarget, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const submitSelectTargetStep = async () => {
    const isValid = await form.trigger([...STEP_FIELDS]);
    if (!isValid) {
      setShowValidationErrors(true);
      return;
    }
    setBuildStep("Summary");
  };

  return {
    fieldErrors,
    isNextDisabled,
    selectTarget,
    submitSelectTargetStep,
    target,
  };
};
