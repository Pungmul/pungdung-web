"use client";

import { useCallback } from "react";

import { BottomFixedButton } from "@/shared";
import { NumberStepper, RangeSlider, TimeInput } from "@/shared/components";
import { WarningCircleIcon } from "@/shared/components/Icons";

import { LIGHTNING_CREATE_FORM_FIELD } from "../../../constants";
import { useSelectTimeAndPersonnelStepForm } from "../../../hooks/form";

const F = LIGHTNING_CREATE_FORM_FIELD;

export function SelectTimeAndPersonnelStep() {
  const {
    fieldErrors,
    isNextDisabled,
    maxPersonnel,
    minPersonnel,
    minRecruitEndTime,
    recruitEndTime,
    submitSelectTimeAndPersonnelStep,
    updatePersonnelRange,
    updateRecruitEndTime,
  } = useSelectTimeAndPersonnelStepForm();

  const handleMinPersonnelChange = useCallback((min: number, max: number) => {
    updatePersonnelRange(min, max);
  }, [updatePersonnelRange]);

  return (
    <>
      {/* 모집 마감 시간 */}
      <div className="flex flex-1 flex-col px-6 py-4 overflow-y-auto gap-8">
        <div className="space-y-3">
          <TimeInput
            label="모집 마감 시간"
            value={recruitEndTime}
            onChange={updateRecruitEndTime}
            placeholder="모집 마감 시간을 선택해주세요"
            minTime={minRecruitEndTime}
            {...(fieldErrors[F.RECRUIT_END_TIME]
              ? { errorMessage: fieldErrors[F.RECRUIT_END_TIME] }
              : {})}
          />
        </div>

        {/* 인원 선택 */}
        <div className="space-y-8">
          {/* Steppers */}
          <div className="flex gap-4 flex-col px-1">
            <div className="flex-1 flex flex-col gap-1">
              <NumberStepper
                label="최소 인원"
                value={minPersonnel}
                min={4}
                max={99}
                onChange={(newValue) => {
                  // 최대 인원보다 작아야 함
                  if (newValue < maxPersonnel) {
                    handleMinPersonnelChange(newValue, maxPersonnel);
                  }
                }}
                onDecrement={() => {
                  const newValue = Math.max(4, minPersonnel - 1);
                  if (newValue < maxPersonnel) {
                    handleMinPersonnelChange(newValue, maxPersonnel);
                  }
                }}
                onIncrement={() => {
                  const newValue = Math.min(maxPersonnel - 1, minPersonnel + 1);
                  handleMinPersonnelChange(newValue, maxPersonnel);
                }}
                canDecrement={minPersonnel > 4}
                canIncrement={minPersonnel < maxPersonnel - 1}
              />
              {fieldErrors[F.MIN_PERSONNEL] ? (
                <div className="flex flex-row items-center gap-[4px] px-1">
                  <WarningCircleIcon className="shrink-0 text-red-400" />
                  <p className="text-[12px] text-red-500">
                    {fieldErrors[F.MIN_PERSONNEL]}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <NumberStepper
                label="최대 인원"
                value={maxPersonnel}
                min={5}
                max={100}
                onChange={(newValue) => {
                  // 최소 인원보다 커야 함
                  if (newValue > minPersonnel) {
                    handleMinPersonnelChange(minPersonnel, newValue);
                  }
                }}
                onDecrement={() => {
                  const newValue = Math.max(minPersonnel + 1, maxPersonnel - 1);
                  handleMinPersonnelChange(minPersonnel, newValue);
                }}
                onIncrement={() => {
                  const newValue = Math.min(100, maxPersonnel + 1);
                  handleMinPersonnelChange(minPersonnel, newValue);
                }}
                canDecrement={maxPersonnel > minPersonnel + 1}
                canIncrement={maxPersonnel < 100}
              />
              {fieldErrors[F.MAX_PERSONNEL] ? (
                <div className="flex flex-row items-center gap-[4px] px-1">
                  <WarningCircleIcon className="shrink-0 text-red-400" />
                  <p className="text-[12px] text-red-500">
                    {fieldErrors[F.MAX_PERSONNEL]}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Slider */}
          <div className="px-1">
            <RangeSlider
              minValue={minPersonnel}
              maxValue={maxPersonnel}
              min={4}
              max={100}
              step={1}
              onChange={handleMinPersonnelChange}
            />
          </div>
        </div>
      </div>

      <BottomFixedButton
        disabled={isNextDisabled}
        onClick={() => {
          void submitSelectTimeAndPersonnelStep();
        }}
      >
        다음
      </BottomFixedButton>
    </>
  );
}
