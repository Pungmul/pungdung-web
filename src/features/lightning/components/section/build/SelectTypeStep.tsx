"use client";

import { BottomFixedButton } from "@/shared";
import { ChipButton } from "@/shared/components";

import { useSelectTypeStepForm } from "../../../hooks/form";

export function SelectTypeStep() {
  const { lightningType, selectLightningType, submitSelectTypeStep } =
    useSelectTypeStepForm();

  return (
    <>
      <div className="flex flex-1 flex-col px-6 py-4 overflow-y-auto">
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
      </div>

      <BottomFixedButton
        onClick={() => {
          void submitSelectTypeStep();
        }}
      >
        다음
      </BottomFixedButton>
    </>
  );
}
