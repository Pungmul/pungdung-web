"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";

import type { ErrorBoundaryFallbackProps } from "@suspensive/react";
import { ErrorBoundary, Suspense } from "@suspensive/react";

import { UpcomingPerformanceItemSkeleton } from "@/features/promotion";

import { Button } from "@/shared";

function UpcomingPromotionsSuspenseFallback() {
  return (
    <section className="w-full flex flex-col">
      <UpcomingPerformanceItemSkeleton length={8} />
    </section>
  );
}

function UpcomingPromotionsErrorFallback({
  reset: resetBoundary,
}: ErrorBoundaryFallbackProps) {
  return (
    <section className="flex-1 flex flex-col items-center justify-center gap-4 px-[16px] text-center">
      <p className="text-grey-800 text-base leading-relaxed whitespace-pre-line">
        {"관람 예정된 공연 목록을 불러오는데 실패했어요\n계속 실패하면 관리자에게 문의해주세요."}
      </p>
      <Button type="button" onClick={resetBoundary}>
        다시 시도
      </Button>
    </section>
  );
}

export default function UpcomingPromotionsBoundary({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset: resetQueries }) => (
        <ErrorBoundary
          onReset={resetQueries}
          fallback={UpcomingPromotionsErrorFallback}
        >
          <Suspense clientOnly fallback={<UpcomingPromotionsSuspenseFallback />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}