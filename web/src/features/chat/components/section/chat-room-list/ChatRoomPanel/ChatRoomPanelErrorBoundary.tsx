"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";

import { ErrorBoundary } from "@suspensive/react";

import {
  isSectionAuthError,
  reportSectionAppError,
} from "@/core/config/report-app-error";

import { ChatRoomPanelErrorFallback } from "./ChatRoomPanelErrorFallback";

export function ChatRoomPanelErrorBoundary({
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
          fallback={ChatRoomPanelErrorFallback}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
