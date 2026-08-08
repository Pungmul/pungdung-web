"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";

import type { ErrorBoundaryFallbackProps } from "@suspensive/react";
import { ErrorBoundary, Suspense } from "@suspensive/react";

import {
  isSectionAuthError,
  reportPageRouteAppError,
} from "@/core/config/report-app-error";

import { Button } from "@/shared";

import {
  ChangePasswordFormSkeleton,
  ChangePasswordPageLayout,
} from "./_ChangePasswordPage";

function ChangePasswordSuspenseFallback() {
  return (
    <ChangePasswordPageLayout>
      <ChangePasswordFormSkeleton />
    </ChangePasswordPageLayout>
  );
}

function ChangePasswordErrorFallback({
  reset: resetBoundary,
}: ErrorBoundaryFallbackProps) {
  return (
    <ChangePasswordPageLayout descriptionLine="비밀번호 변경 정보를 불러오지 못했어요.">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-[16px] text-center">
        <p className="text-grey-800 text-base leading-relaxed whitespace-pre-line">
          {
            "비밀번호 변경 정보를 불러오는데 실패했어요\n계속 실패하면 관리자에게 문의해주세요."
          }
        </p>
        <Button type="button" onClick={resetBoundary}>
          다시 시도
        </Button>
      </div>
    </ChangePasswordPageLayout>
  );
}

export default function ChangePasswordBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset: resetQueries }) => (
        <ErrorBoundary
          onReset={resetQueries}
          shouldCatch={(error) => !isSectionAuthError(error)}
          onError={(error) => {
            reportPageRouteAppError(error, import.meta.url);
          }}
          fallback={ChangePasswordErrorFallback}
        >
          <Suspense clientOnly fallback={<ChangePasswordSuspenseFallback />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
