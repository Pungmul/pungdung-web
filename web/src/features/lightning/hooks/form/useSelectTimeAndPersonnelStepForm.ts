"use client";

import { useCallback, useMemo, useState } from "react";

import { useFormContext, useWatch } from "react-hook-form";

import dayjs from "dayjs";

import {
  LIGHTNING_CREATE_FORM_FIELD,
  LIGHTNING_CREATE_STEP_FIELD,
} from "../../constants";
import { useLightningBuildContext } from "../../providers";
import { zodIssuesToStepFieldMessages } from "../../services";
import {
  type LightningCreateFormData,
  lightningSelectTimeAndPersonnelStepSchema,
} from "../../types/schemas";

const FIELDS = LIGHTNING_CREATE_FORM_FIELD;
const STEP_FIELDS = LIGHTNING_CREATE_STEP_FIELD.SELECT_TIME_AND_PERSONNEL;

/**
 * 모집 마감 시간은 `LIGHTNING_CREATE_FORM_DEFAULTS`에서 빈 문자열로만 두고,
 * 이 훅에서 현재 시각으로 초기화하지 않는다. (`TimeInput`은 `value=""`일 때 placeholder만 표시)
 */
export const useSelectTimeAndPersonnelStepForm = () => {
  const form = useFormContext<LightningCreateFormData>();
  const { setBuildStep } = useLightningBuildContext();
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [
    watchedRecruitEndTime,
    watchedStartTime,
    watchedStartTimeUndecided,
    minPersonnel,
    maxPersonnel,
  ] = useWatch({
    control: form.control,
    name: [
      FIELDS.RECRUIT_END_TIME,
      FIELDS.START_TIME,
      FIELDS.IS_START_TIME_UNDECIDED,
      FIELDS.MIN_PERSONNEL,
      FIELDS.MAX_PERSONNEL,
    ],
  });

  const recruitEndTime = watchedRecruitEndTime ?? "";
  const startTime = watchedStartTime ?? "";
  const isStartTimeUndecided = watchedStartTimeUndecided ?? false;
  const minRecruitEndTime = dayjs().format("HH:mm");
  const minStartTime =
    recruitEndTime > minRecruitEndTime ? recruitEndTime : minRecruitEndTime;

  const parsedStep = useMemo(() => {
    const result = lightningSelectTimeAndPersonnelStepSchema.safeParse({
      [FIELDS.RECRUIT_END_TIME]: recruitEndTime,
      [FIELDS.START_TIME]: startTime,
      [FIELDS.IS_START_TIME_UNDECIDED]: isStartTimeUndecided,
      [FIELDS.MIN_PERSONNEL]: minPersonnel,
      [FIELDS.MAX_PERSONNEL]: maxPersonnel,
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
  }, [recruitEndTime, startTime, isStartTimeUndecided, minPersonnel, maxPersonnel]);

  const fieldErrors = showValidationErrors ? parsedStep.fieldErrors : {};
  const isNextDisabled =
    showValidationErrors && !parsedStep.isStepValueValid;

  const updateRecruitEndTime = (nextRecruitEndTime: string) => {
    form.setValue(FIELDS.RECRUIT_END_TIME, nextRecruitEndTime, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const updateStartTime = (nextStartTime: string) => {
    form.setValue(FIELDS.START_TIME, nextStartTime, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const updateStartTimeUndecided = (nextUndecided: boolean) => {
    form.setValue(FIELDS.IS_START_TIME_UNDECIDED, nextUndecided, {
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
    if (!isValid) {
      setShowValidationErrors(true);
      return;
    }
    setBuildStep("SelectTarget");
  };

  return {
    fieldErrors,
    isNextDisabled,
    isStartTimeUndecided,
    maxPersonnel,
    minPersonnel,
    minRecruitEndTime,
    minStartTime,
    recruitEndTime,
    startTime,
    submitSelectTimeAndPersonnelStep,
    updatePersonnelRange,
    updateRecruitEndTime,
    updateStartTime,
    updateStartTimeUndecided,
  };
};
