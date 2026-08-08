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

function NearLightningContentErrorFallback({
  error,
  reset,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className="relative w-full">
      <div className="mx-auto flex aspect-[16/9] w-[280px] flex-col items-center justify-center px-3 text-center">
        <p className="mb-2 whitespace-pre-wrap text-sm leading-relaxed text-grey-400">
          근처 번개를 불러오는데 실패했어요.
        </p>
        {process.env.NODE_ENV === "development" ? (
          <pre className="mb-2 max-w-full overflow-auto text-left text-xs text-grey-400">
            {error.message}
          </pre>
        ) : null}
        <button
          type="button"
          className="text-blue-500 underline hover:text-blue-700"
          onClick={reset}
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}

export function NearLightningContentErrorBoundary({
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
          fallback={NearLightningContentErrorFallback}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
