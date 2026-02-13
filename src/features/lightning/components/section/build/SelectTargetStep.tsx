"use client";

import { BottomFixedButton } from "@/shared";
import { ChipButton } from "@/shared/components";

import { useSelectTargetStepForm } from "../../../hooks/form";

export function SelectTargetStep() {
  const { selectTarget, submitSelectTargetStep, target } =
    useSelectTargetStepForm();

  return (
    <>
      <div className="flex flex-1 flex-col px-6 py-4 overflow-y-auto">
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
      </div>

      <BottomFixedButton
        onClick={() => {
          void submitSelectTargetStep();
        }}
      >
        다음
      </BottomFixedButton>
    </>
  );
}
