"use client";

import { ErrorBoundary } from "@suspensive/react";

import {
  isSectionAuthError,
  reportPageRouteAppError,
} from "@/core/config/report-app-error";

import { ChatLoadFailFallback } from "@/features/chat";

export function ChatsLayoutBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      shouldCatch={(error) => !isSectionAuthError(error)}
      onError={(error) => {
        reportPageRouteAppError(error, import.meta.url);
      }}
      fallback={ChatLoadFailFallback}
    >
      {children}
    </ErrorBoundary>
  );
}
