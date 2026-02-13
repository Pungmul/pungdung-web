"use client";

import { useCallback } from "react";

import { useFormContext, useWatch } from "react-hook-form";

import {
  LIGHTNING_CREATE_FORM_FIELD,
  LIGHTNING_CREATE_STEP_FIELD,
} from "../../constants";
import { useLightningBuildContext } from "../../providers";
import type { LightningCreateFormData } from "../../types/schemas";

const FIELDS = LIGHTNING_CREATE_FORM_FIELD;
const STEP_FIELDS = LIGHTNING_CREATE_STEP_FIELD.SELECT_TIME_AND_PERSONNEL;

export const useSelectTimeAndPersonnelStepForm = () => {
  const form = useFormContext<LightningCreateFormData>();
  const { setBuildStep } = useLightningBuildContext();
  const [recruitEndTime, minPersonnel, maxPersonnel] = useWatch({
    control: form.control,
    name: [FIELDS.RECRUIT_END_TIME, FIELDS.MIN_PERSONNEL, FIELDS.MAX_PERSONNEL],
  });

  const updateRecruitEndTime = (nextRecruitEndTime: string) => {
    form.setValue(FIELDS.RECRUIT_END_TIME, nextRecruitEndTime, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const updatePersonnelRange = useCallback(
    (nextMinPersonnel: number, nextMaxPersonnel: number) => {
      form.setValue(FIELDS.MIN_PERSONNEL, nextMinPersonnel, {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue(FIELDS.MAX_PERSONNEL, nextMaxPersonnel, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [form]
  );

  const submitSelectTimeAndPersonnelStep = async () => {
    const isValid = await form.trigger([...STEP_FIELDS]);
    if (isValid) {
      setBuildStep("SelectTarget");
    }
  };

  return {
    maxPersonnel,
    minPersonnel,
    recruitEndTime,
    submitSelectTimeAndPersonnelStep,
    updatePersonnelRange,
    updateRecruitEndTime,
  };
};
