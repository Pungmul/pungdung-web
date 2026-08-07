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

function HomeHotPostListErrorFallback({
  error,
  reset,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className="flex min-h-[560px] flex-col items-center justify-center gap-3 rounded-[4px] px-4 text-center shadow-up-sm">
      <p className="text-grey-600">인기글을 불러오지 못했습니다.</p>
      {process.env.NODE_ENV === "development" ? (
        <pre className="max-w-full overflow-auto text-left text-xs text-grey-400">
          {error.message}
        </pre>
      ) : null}
      <button type="button" className="text-primary underline" onClick={reset}>
        다시 시도
      </button>
    </div>
  );
}

export function HomeHotPostListErrorBoundary({
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
            reportAppError(error, { boundary: "section", feature: "home" });
          }}
          fallback={HomeHotPostListErrorFallback}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
