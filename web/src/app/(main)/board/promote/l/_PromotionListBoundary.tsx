"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";

import type { ErrorBoundaryFallbackProps } from "@suspensive/react";
import { ErrorBoundary, Suspense } from "@suspensive/react";

import {
  isSectionAuthError,
  reportPageRouteAppError,
} from "@/core/config/report-app-error";

import { PromotionPostBoxSkeleton } from "@/features/promotion";

import { Button } from "@/shared";

function PromotionListSuspenseFallback() {
  return (
    <ul className="relative grid grid-cols-2 md:grid-cols-3 gap-[12px] w-full bg-background px-[24px] md:px-0 list-none">
      <PromotionPostBoxSkeleton length={9} />
    </ul>
  );
}

function PromotionListErrorFallback({
  reset: resetBoundary,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-[16px] py-16 text-center">
      <p className="text-grey-800 text-base leading-relaxed whitespace-pre-line">
        {"홍보 목록을 불러오지 못했어요.\n다시 시도해 주세요."}
      </p>
      <Button type="button" onClick={resetBoundary}>
        다시 시도
      </Button>
    </div>
  );
}

export default function PromotionListBoundary({
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
          fallback={PromotionListErrorFallback}
        >
          <Suspense clientOnly fallback={<PromotionListSuspenseFallback />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
