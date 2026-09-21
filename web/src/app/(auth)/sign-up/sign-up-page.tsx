"use client";

import { FormProvider } from "react-hook-form";

import { match } from "ts-pattern";
import { Suspense } from "@suspensive/react";

import {
  Header,
  Spinner,
} from "@/shared";

import {
  AccountStep,
  CompleteStep,
  EmailSignUpStepIndicator,
  PersonalStep,
  TermsStep,
} from "@/features/auth/components";
import { useEmailSignUpFlow } from "@/features/auth/hooks/actions";

type SignUpPageProps = {
  initialInviteCode: string;
};

export function SignUpPage({ initialInviteCode }: SignUpPageProps) {
  return (
    <main className="w-full min-h-app h-full flex flex-col">
      <Header title="회원가입" />
      <Suspense
        clientOnly
        fallback={
          <div className="flex-grow flex items-center justify-center">
            <Spinner size={32} />
          </div>
        }
      >
        <SignUpPageContent initialInviteCode={initialInviteCode} />
      </Suspense>
    </main>
  );
}

function SignUpPageContent({ initialInviteCode }: SignUpPageProps) {
  const {
    form,
    currentStep,
    agree,
    submitAccount,
    back,
    submitSignup,
    completion,
  } = useEmailSignUpFlow(initialInviteCode);

  return (
    <FormProvider {...form}>
      <EmailSignUpStepIndicator currentStep={currentStep} />
      <section className="flex flex-col flex-grow flex-shrink-0">
        {match(currentStep)
          .with("약관동의", () => (
            <TermsStep
              onSubmit={agree}
            />
          ))
          .with("계정정보입력", () => (
            <AccountStep
              onPrevStep={back}
              onSubmit={submitAccount}
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
