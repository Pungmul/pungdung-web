"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";

import { ErrorBoundary } from "@suspensive/react";

import {
  isSectionAuthError,
  reportAppError,
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
            reportAppError(error, { boundary: "section", feature: "chat" });
          }}
          fallback={ChatRoomPanelErrorFallback}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
