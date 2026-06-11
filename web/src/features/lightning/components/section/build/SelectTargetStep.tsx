"use client";

import { BottomFixedButton } from "@/shared";
import { ChipButton } from "@/shared/components";
import { WarningCircleIcon } from "@/shared/components/Icons";

import { LIGHTNING_CREATE_FORM_FIELD } from "../../../constants";
import { useSelectTargetStepForm } from "../../../hooks/form";

const F = LIGHTNING_CREATE_FORM_FIELD;

export function SelectTargetStep() {
  const {
    fieldErrors,
    isNextDisabled,
    selectTarget,
    submitSelectTargetStep,
    target,
  } = useSelectTargetStepForm();

  const scopeErrorMessage = fieldErrors[F.TARGET];

  return (
    <>
      <div className="flex flex-1 flex-col px-6 py-4 overflow-y-auto gap-3">
        <div className="flex flex-row gap-4">
          <ChipButton
            type="button"
            onClick={() => selectTarget("전체")}
            filled={target === "전체"}
            className="flex-1 aspect-square rounded-2xl text-lg flex items-center justify-center"
          >
            전체
          </ChipButton>
          <ChipButton
            type="button"
            onClick={() => selectTarget("우리 학교만")}
            filled={target === "우리 학교만"}
            className="flex-1 aspect-square rounded-2xl text-lg flex items-center justify-center"
          >
            우리 학교만
          </ChipButton>
        </div>
        {scopeErrorMessage ? (
          <div className="flex flex-row items-center gap-[4px] px-1">
            <span className="flex size-4 shrink-0 items-center justify-center"><WarningCircleIcon className="size-full text-red-400" /></span>
            <p className="text-[12px] text-red-500">{scopeErrorMessage}</p>
          </div>
        ) : null}
      </div>

      <BottomFixedButton
        disabled={isNextDisabled}
        onClick={() => {
          void submitSelectTargetStep();
        }}
      >
        다음
      </BottomFixedButton>
    </>
  );
}
