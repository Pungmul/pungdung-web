"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";

import {
  ErrorBoundary,
  type ErrorBoundaryFallbackProps,
} from "@suspensive/react";

import {
  isSectionAuthError,
  reportAppError,
} from "@/core/config/report-app-error";

import { Button, Header } from "@/shared";

function ResponseDetailErrorFallback({
  error,
  reset,
}: ErrorBoundaryFallbackProps) {
  return (
    <>
      <Header title="" isBackBtn={false} />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-grey-600">공연 응답을 불러오지 못했습니다.</p>
        {process.env.NODE_ENV === "development" ? (
          <pre className="max-w-full overflow-auto text-left text-xs text-grey-400">
            {error.message}
          </pre>
        ) : null}
        <Button type="button" onClick={reset}>
          다시 시도
        </Button>
      </div>
    </>
  );
}

export function ResponseDetailErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          shouldCatch={(error) => !isSectionAuthError(error)}
          onError={(error) => {
            reportAppError(error, { boundary: "section", feature: "promotion" });
          }}
          fallback={ResponseDetailErrorFallback}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
