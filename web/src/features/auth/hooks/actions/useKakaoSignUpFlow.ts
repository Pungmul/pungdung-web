"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

import { useKakaoSignUpActions } from "./useKakaoSignUpActions";
import { AUTH_DOMAIN_MESSAGE, KAKAO_SIGN_UP_STEP_ORDER } from "../../constants";
import { useKakaoSignUpStepForm } from "../form";
import { useSignUpStepCursor } from "../state";

export function useKakaoSignUpFlow(initialInviteCode: string) {
  const router = useRouter();
  const form = useKakaoSignUpStepForm(initialInviteCode);
  const { currentStep, setCurrentStep, onNextStep, onPrevStep } = useSignUpStepCursor({
    stepOrder: KAKAO_SIGN_UP_STEP_ORDER,
    initialStep: "약관동의",
  });
  const { mutateAsync, isPending, isError, isSuccess, error, reset } = useKakaoSignUpActions();
  const lockedRef = useRef(false);

  const submitSignup = useCallback(async () => {
    if (lockedRef.current) {
      return;
    }
    lockedRef.current = true;
    const payload = form.getValues();
    setCurrentStep("완료");
    try {
      await mutateAsync(payload);
    } catch {
      // 실패 화면은 isError
      lockedRef.current = false;
    }
  }, [form, mutateAsync, setCurrentStep]);

  const edit = useCallback(() => {
    lockedRef.current = false;
    reset();
    onPrevStep();
  }, [onPrevStep, reset]);

  const goToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  const goHome = useCallback(() => {
    router.push("/home");
  }, [router]);

  return {
    form,
    currentStep,
    agree: onNextStep,
    back: onPrevStep,
    submitSignup,
    completion: {
      isPending,
      isError,
      isSuccess,
      error,
      onRetry: submitSignup,
      onEdit: edit,
      onGoToLogin: goToLogin,
      onFinish: goHome,
      finishLabel: AUTH_DOMAIN_MESSAGE.SIGN_UP_COMPLETE.GO_TO_HOME,
    },
  };
}
