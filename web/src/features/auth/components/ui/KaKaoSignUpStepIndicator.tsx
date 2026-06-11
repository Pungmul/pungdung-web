import { cn } from "@/shared";

import { AUTH_UI_MESSAGE, KAKAO_SIGN_UP_STEP_ORDER } from "../../constants";
import { getSignUpStepCircleBgClass } from "../../lib";
import type { KakaoSignUpStep } from "../../types";

export function KaKaoSignUpStepIndicator({ currentStep }: { currentStep: KakaoSignUpStep }) {
  return (
    <div
      className="shrink-0 flex flex-row items-center justify-center my-[28px] min-w-96 mx-auto px-[12px] pt-[4px]"
    >
      <div
        className="flex flex-col items-center overflow-visible gap-[8px] w-[48px]"
      >
        <div
          className={cn("flex items-center justify-center", getSignUpStepCircleBgClass(KAKAO_SIGN_UP_STEP_ORDER, 0, currentStep), "rounded-full w-[36px] h-[36px]")}
        >
          <div className="text-white">1</div>
        </div>
        <div
          className="text-[14px] text-center text-grey-500 leading-[110%] w-[100px]"
        >
          {AUTH_UI_MESSAGE.STEP_INDICATOR.TERMS}
        </div>
      </div>

      <div
        className="border-dashed border border-grey-400 w-[65px] mb-[28px]"
      />

      <div
        className="flex flex-col items-center overflow-visible gap-[8px] w-[48px]"
      >
        <div
          className={cn("flex items-center justify-center", getSignUpStepCircleBgClass(KAKAO_SIGN_UP_STEP_ORDER, 1, currentStep), "rounded-full w-[36px] h-[36px]")}
        >
          <div className="text-white">2</div>
        </div>
        <div
          className="text-[14px] text-center text-grey-500 leading-[110%] w-[100px]"
        >
          {AUTH_UI_MESSAGE.STEP_INDICATOR.PERSONAL}
        </div>
      </div>
    </div>
  );
}
