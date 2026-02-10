"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { FormProvider } from "react-hook-form";

import { match } from "ts-pattern";

import { Header } from "@/shared/components";

import { CompleteStep, KaKaoSignUpStepIndicator, PersonalStep, TermsStep } from "@/features/auth/components";
import { KAKAO_SIGN_UP_STEP_ORDER } from "@/features/auth/constants";
import { useKakaoSignUpActions } from "@/features/auth/hooks/actions";
import {
  useKakaoSignUpStepForm,
} from "@/features/auth/hooks/form";
import { useSignUpStepState } from "@/features/auth/hooks/state";
import type { IKakaoSignUpFormData } from "@/features/auth/types/schemas";

const initialKakaoSignUpData: IKakaoSignUpFormData = {
  name: "",
  nickname: "",
  club: undefined,
  clubAge: "",
  tellNumber: "",
  inviteCode: "",
};

export default function KakaoSignUpPage() {
  const router = useRouter();
  const { currentStep, data: signUpData, onSubmit, onNextStep, onPrevStep } =
    useSignUpStepState({
      stepOrder: KAKAO_SIGN_UP_STEP_ORDER,
      initialStep: "약관동의",
      initialData: initialKakaoSignUpData,
    });
  const formMethods = useKakaoSignUpStepForm();
  const { submitFinalSignUp, isPending, error } = useKakaoSignUpActions();

  const runFinalSignUp = useCallback(() => {
    return submitFinalSignUp(signUpData, {
      onSuccess: () => {
        router.push("/home");
      },
      onError: (err: unknown) => {
        console.error(err);
      },
    });
  }, [submitFinalSignUp, signUpData, router]);

  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    const enteredComplete =
      currentStep === "완료" && prevStepRef.current !== "완료";
    prevStepRef.current = currentStep;
    if (!enteredComplete) {
      return;
    }
    void runFinalSignUp();
  }, [currentStep, runFinalSignUp]);

  const onNavigateToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  return (
    <main className="w-full flex flex-col min-h-app">
      <FormProvider {...formMethods}>
        <Header title="회원가입" />
        <KaKaoSignUpStepIndicator currentStep={currentStep} />
        <section className="flex flex-col flex-grow flex-shrink-0">
          {match(currentStep)
            .with("약관동의", () => (
              <TermsStep
                onSubmit={(stepData) => {
                  // onSubmit(stepData as Partial<KakaoSignUpFormData>);
                  console.log(stepData);
                  onNextStep();
                }}
              />
            ))
            .with("개인정보입력", () => (
              <PersonalStep
                onPrevStep={onPrevStep}
                onSubmit={(stepData) => {
                  onSubmit(stepData);
                  console.log(stepData);
                  onNextStep();
                }}
              />
            ))
            .with("완료", () => (
              <CompleteStep
                isPending={isPending}
                error={error}
                onRetry={() => {
                  void runFinalSignUp();
                }}
                onBackToInput={onPrevStep}
                onNavigateToLogin={onNavigateToLogin}
              />
            ))
            .exhaustive()}
        </section>
      </FormProvider>
    </main>
  );
}
