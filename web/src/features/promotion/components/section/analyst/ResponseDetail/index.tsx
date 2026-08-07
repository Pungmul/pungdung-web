"use client";

import { Suspense } from "@suspensive/react";

import { Header, Spinner } from "@/shared";

import { ResponseDetail as ResponseDetailImpl } from "./ResponseDetail";
import { ResponseDetailErrorBoundary } from "./ResponseDetailErrorBoundary";

export function ResponseDetail({ responseId }: { responseId: string }) {
  return (
    <ResponseDetailErrorBoundary>
      <Suspense
        clientOnly
        fallback={
          <>
            <Header title="" isBackBtn={false} />
            <div className="flex w-full flex-1 flex-col items-center justify-center">
              <Spinner size={32} />
            </div>
          </>
        }
      >
        <ResponseDetailImpl responseId={responseId} />
      </Suspense>
    </ResponseDetailErrorBoundary>
  );
}
