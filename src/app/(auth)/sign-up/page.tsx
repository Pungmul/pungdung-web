"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { FormProvider } from "react-hook-form";

import { match } from "ts-pattern";

import { Header } from "@/shared/components";

import {
  AccountStep,
  CompleteStep,
  EmailSignUpStepIndicator,
  PersonalStep,
  TermsStep,
} from "@/features/auth/components";
import { EMAIL_SIGN_UP_STEP_ORDER } from "@/features/auth/constants";
import { useEmailSignUpActions } from "@/features/auth/hooks/actions";
import {
  useEmailSignUpStepForm,
} from "@/features/auth/hooks/form";
import { useSignUpStepState } from "@/features/auth/hooks/state";
import type { IEmailSignUpFormData } from "@/features/auth/types/schemas";

const initialEmailSignUpData: IEmailSignUpFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  nickname: "",
  club: undefined,
  clubAge: "",
  tellNumber: "",
  inviteCode: "",
};

export default function SignUpPage() {
  const router = useRouter();
  const { currentStep, data: signUpData, onSubmit, onNextStep, onPrevStep } =
    useSignUpStepState({
      stepOrder: EMAIL_SIGN_UP_STEP_ORDER,
      initialStep: "약관동의",
      initialData: initialEmailSignUpData,
    });
  const formMethods = useEmailSignUpStepForm();
  const { submitFinalSignUp, isPending, error } = useEmailSignUpActions();

  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    const enteredComplete =
      currentStep === "완료" && prevStepRef.current !== "완료";
    prevStepRef.current = currentStep;
    if (!enteredComplete) {
      return;
    }
    void (submitFinalSignUp(signUpData));
  }, [currentStep, submitFinalSignUp, signUpData]);

  const onNavigateToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  return (
    <main className="w-full min-h-app h-full flex flex-col">
      <FormProvider {...formMethods}>
        <Header title="회원가입" />
        <EmailSignUpStepIndicator currentStep={currentStep} />
        <section className="flex flex-col flex-grow flex-shrink-0">
          {match(currentStep)
            .with("약관동의", () => (
              <TermsStep
                onSubmit={(stepData) => {
                  onSubmit(stepData as Partial<IEmailSignUpFormData>);
                  onNextStep();
                }}
              />
            ))
            .with("계정정보입력", () => (
              <AccountStep
                onPrevStep={onPrevStep}
                onSubmit={(stepData) => {
                  onSubmit(stepData);
                  onNextStep();
                }}
              />
            ))
            .with("개인정보입력", () => (
              <PersonalStep
                onPrevStep={onPrevStep}
                onSubmit={(stepData) => {
                  onSubmit(stepData);
                  onNextStep();
                }}
              />
            ))
            .with("완료", () => (
              <CompleteStep
                isPending={isPending}
                error={error}
                onRetry={() => {
                  void (submitFinalSignUp(signUpData));
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
