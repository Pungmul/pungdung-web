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
    targetValue,
    maxPersonnel,
    minPersonnel,
  ] = useWatch({
    control,
    name: [...SUMMARY_WATCH],
  });

  const { lightningType, location, time, target } =
    buildLightningSummaryDisplay({
      lightningType: lightningTypeValue as
        | LightningCreateFormData[typeof FIELDS.LIGHTNING_TYPE]
        | undefined,
      address,
      recruitEndTime,
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
    target,
    time,
  };
};
