"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

import { useEmailSignUpActions } from "./useEmailSignUpActions";
import { AUTH_DOMAIN_MESSAGE, EMAIL_SIGN_UP_STEP_ORDER } from "../../constants";
import { useEmailSignUpStepForm } from "../form";
import { useSignUpStepCursor } from "../state";

export function useEmailSignUpFlow(initialInviteCode: string) {
  const router = useRouter();
  const form = useEmailSignUpStepForm(initialInviteCode);
  const { currentStep, setCurrentStep, onNextStep, onPrevStep } =
    useSignUpStepCursor({
      stepOrder: EMAIL_SIGN_UP_STEP_ORDER,
      initialStep: "약관동의",
    });
  const { mutateAsync, isPending, isError, isSuccess, error, reset } =
    useEmailSignUpActions();
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

  return {
    form,
    currentStep,
    agree: onNextStep,
    submitAccount: onNextStep,
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
      onFinish: goToLogin,
      finishLabel: AUTH_DOMAIN_MESSAGE.SIGN_UP_COMPLETE.GO_TO_LOGIN,
    },
  };
}
