"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";

import type { ErrorBoundaryFallbackProps } from "@suspensive/react";
import { ErrorBoundary, Suspense } from "@suspensive/react";

import { Button, Header, Spinner } from "@/shared";

function PromotionDetailSuspenseFallback() {
  return (
    <div className="w-full flex flex-col gap-[12px] md:max-w-[768px] mx-auto min-h-screen bg-background">
      <Header title={""} isBackBtn={true} />
      <div className="flex-1 flex items-center justify-center">
        <Spinner size={32} />
      </div>
    </div>
  );
}

function PromotionDetailErrorFallback({
  reset: resetBoundary,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className="w-full flex flex-col gap-[12px] md:max-w-[768px] mx-auto min-h-screen bg-background">
      <Header title={""} isBackBtn={true} />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-[16px] text-center">
        <p className="text-grey-800 text-base leading-relaxed whitespace-pre-line">
          {"공연의 상세정보를 불러오는데 실패했어요\n계속 실패하면 관리자에게 문의해주세요."}
        </p>
        <Button type="button" onClick={resetBoundary}>
          다시 시도
        </Button>
      </div>
    </div>
  );
}


export default function PromotionDetailBoundary({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset: resetQueries }) => (
        <ErrorBoundary
          onReset={resetQueries}
          fallback={PromotionDetailErrorFallback}
        >
          <Suspense clientOnly fallback={<PromotionDetailSuspenseFallback />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}