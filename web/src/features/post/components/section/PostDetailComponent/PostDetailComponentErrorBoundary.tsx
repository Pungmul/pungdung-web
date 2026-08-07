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

function PostDetailComponentErrorFallback({
  error,
  reset,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className="mx-auto flex min-h-[292px] w-full max-w-[768px] flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-grey-600">게시글을 불러오지 못했습니다.</p>
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

export function PostDetailComponentErrorBoundary({
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
            reportAppError(error, { boundary: "section", feature: "post" });
          }}
          fallback={PostDetailComponentErrorFallback}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
