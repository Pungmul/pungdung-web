"use client";

import { FormProvider } from "react-hook-form";

import { match } from "ts-pattern";
import { Suspense } from "@suspensive/react";

import {
  Header,
  Spinner,
} from "@/shared";

import { CompleteStep, KaKaoSignUpStepIndicator, PersonalStep, TermsStep } from "@/features/auth/components";
import { useKakaoSignUpFlow } from "@/features/auth/hooks/actions";

type KakaoSignUpPageProps = {
  initialInviteCode: string;
};

export function KakaoSignUpPage({ initialInviteCode }: KakaoSignUpPageProps) {
  return (
    <main className="w-full flex flex-col min-h-app">
      <Header title="회원가입" />
      <Suspense
        clientOnly
        fallback={
          <div className="flex-grow flex items-center justify-center">
            <Spinner size={32} />
          </div>
        }
      >
        <KakaoSignUpPageContent initialInviteCode={initialInviteCode} />
      </Suspense>
    </main>
  );
}

function KakaoSignUpPageContent({ initialInviteCode }: KakaoSignUpPageProps) {
  const {
    form,
    currentStep,
    agree,
    back,
    submitSignup,
    completion,
  } = useKakaoSignUpFlow(initialInviteCode);

  return (
    <FormProvider {...form}>
      <KaKaoSignUpStepIndicator currentStep={currentStep} />
      <section className="flex flex-col flex-grow flex-shrink-0">
        {match(currentStep)
          .with("약관동의", () => (
            <TermsStep
              onSubmit={agree}
            />
          ))
          .with("개인정보입력", () => (
            <PersonalStep
              onPrevStep={back}
              onSubmit={submitSignup}
            />
          ))
          .with("완료", () => (
            <CompleteStep {...completion} />
          ))
          .exhaustive()}
      </section>
    </FormProvider>
  );
}
