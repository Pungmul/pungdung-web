"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";

import {
  ErrorBoundary,
  type ErrorBoundaryFallbackProps,
} from "@suspensive/react";

import {
  isSectionAuthError,
  reportSectionAppError,
} from "@/core/config/report-app-error";

function BoardDetailContentErrorFallback({
  error,
  reset,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <p className="text-grey-600">게시글 목록을 불러오지 못했습니다.</p>
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

export function BoardDetailContentErrorBoundary({
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
            reportSectionAppError(error, import.meta.url);
          }}
          fallback={BoardDetailContentErrorFallback}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
