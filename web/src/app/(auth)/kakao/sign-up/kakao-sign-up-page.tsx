"use client";

import { FormProvider } from "react-hook-form";

import { match } from "ts-pattern";
import { Suspense } from "@suspensive/react";

import { ClientApiError } from "@/core/api/client";

import {
  Button,
  Header,
  Spinner,
} from "@/shared";
import { KakaoLogo } from "@/shared/components/Icons";

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
  const errorCode = completion.error instanceof ClientApiError ? completion.error.code : null;
  const failureMessage = errorCode === "MEMBER_014"
    ? "카카오 로그인 시 이메일 제공 동의가 필요해요.\n다시 로그인해주세요."
    : errorCode === "MEMBER_015"
      ? "오랫동안 가입하지 않아 로그인이 만료되었어요.\n다시 로그인해주세요."
      : undefined;

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
            <CompleteStep
              {...completion}
              {...(failureMessage && {
                failureMessage,
                failureActions: (
                  <Button
                    type="button"
                    className="flex h-12 w-full max-w-[320px] items-center gap-3 !bg-kakao px-6 text-black"
                    onClick={() => {
                      window.location.href = "/api/auth/kakao/login?redirectURL=%2Fhome";
                    }}
                  >
                    <KakaoLogo className="size-5" aria-hidden />
                    카카오로 시작하기
                  </Button>
                ),
              })}
            />
          ))
          .exhaustive()}
      </section>
    </FormProvider>
  );
}
