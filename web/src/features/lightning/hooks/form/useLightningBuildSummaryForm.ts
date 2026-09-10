"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { LIGHTNING_CREATE_FORM_FIELD } from "../../constants";
import { buildLightningSummaryDisplay } from "../../lib";
import { useLightningBuildContext } from "../../providers";
import type { LightningCreateFormData } from "../../types/schemas";

const FIELDS = LIGHTNING_CREATE_FORM_FIELD;

const SUMMARY_WATCH = [
  FIELDS.LIGHTNING_TYPE,
  FIELDS.ADDRESS,
  FIELDS.RECRUIT_END_TIME,
  FIELDS.START_TIME,
  FIELDS.IS_START_TIME_UNDECIDED,
  FIELDS.TARGET,
  FIELDS.MAX_PERSONNEL,
  FIELDS.MIN_PERSONNEL,
] as const;

export const useLightningBuildSummaryForm = () => {
  const { control } = useFormContext<LightningCreateFormData>();
  const { setBuildStep } = useLightningBuildContext();

  const [
    lightningTypeValue,
    address,
    recruitEndTime,
    startTimeValue,
    isStartTimeUndecided,
    targetValue,
    maxPersonnel,
    minPersonnel,
  ] = useWatch({
    control,
    name: [...SUMMARY_WATCH],
  });

  const { lightningType, location, startTime, time, target } =
    buildLightningSummaryDisplay({
      lightningType: lightningTypeValue as
        | LightningCreateFormData[typeof FIELDS.LIGHTNING_TYPE]
        | undefined,
      address,
      recruitEndTime,
      startTime: startTimeValue,
      isStartTimeUndecided,
      target: targetValue as
        | LightningCreateFormData[typeof FIELDS.TARGET]
        | undefined,
    });

  return {
    lightningType,
    location,
    maxPersonnel,
    minPersonnel,
    setBuildStep,
    startTime,
    target,
    time,
  };
};
