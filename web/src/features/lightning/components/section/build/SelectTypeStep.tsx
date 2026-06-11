"use client";

import { BottomFixedButton } from "@/shared";
import { ChipButton } from "@/shared/components";
import { WarningCircleIcon } from "@/shared/components/Icons";

import { LIGHTNING_CREATE_FORM_FIELD } from "../../../constants";
import { useSelectTypeStepForm } from "../../../hooks/form";

const F = LIGHTNING_CREATE_FORM_FIELD;

export function SelectTypeStep() {
  const {
    fieldErrors,
    isNextDisabled,
    lightningType,
    selectLightningType,
    submitSelectTypeStep,
  } = useSelectTypeStepForm();

  const typeErrorMessage = fieldErrors[F.LIGHTNING_TYPE];

  return (
    <>
      <div className="flex flex-1 flex-col px-6 py-4 overflow-y-auto gap-3">
        <div className="flex flex-row gap-4">
          <ChipButton
            type="button"
            onClick={() => selectLightningType("일반 모임")}
            filled={lightningType === "일반 모임"}
            className="flex-1 aspect-square rounded-2xl text-lg flex items-center justify-center"
          >
            일반 모임
          </ChipButton>
          <ChipButton
            type="button"
            onClick={() => selectLightningType("풍물 모임")}
            filled={lightningType === "풍물 모임"}
            className="flex-1 aspect-square rounded-2xl text-lg flex items-center justify-center"
          >
            풍물 모임
          </ChipButton>
        </div>
        {typeErrorMessage ? (
          <div className="flex flex-row items-center gap-[4px] px-1">
            <span className="flex size-4 shrink-0 items-center justify-center"><WarningCircleIcon className="size-full text-red-400" /></span>
            <p className="text-[12px] text-red-500">{typeErrorMessage}</p>
          </div>
        ) : null}
      </div>

      <BottomFixedButton
        disabled={isNextDisabled}
        onClick={() => {
          void submitSelectTypeStep();
        }}
      >
        다음
      </BottomFixedButton>
    </>
  );
}
