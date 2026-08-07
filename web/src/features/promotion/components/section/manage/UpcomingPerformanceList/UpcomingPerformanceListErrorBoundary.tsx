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

import { Button } from "@/shared";

function UpcomingPerformanceListErrorFallback({
  error,
  reset,
}: ErrorBoundaryFallbackProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-4 px-[16px] text-center">
      <p className="whitespace-pre-line text-base leading-relaxed text-grey-800">
        {"관람 예정된 공연 목록을 불러오는데 실패했어요\n계속 실패하면 관리자에게 문의해주세요."}
      </p>
      {process.env.NODE_ENV === "development" ? (
        <pre className="max-w-full overflow-auto text-left text-xs text-grey-400">
          {error.message}
        </pre>
      ) : null}
      <Button type="button" onClick={reset}>
        다시 시도
      </Button>
    </section>
  );
}

export function UpcomingPerformanceListErrorBoundary({
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
          fallback={UpcomingPerformanceListErrorFallback}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
