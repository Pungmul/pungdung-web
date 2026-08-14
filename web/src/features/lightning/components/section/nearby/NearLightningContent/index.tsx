"use client";

import { Suspense } from "@suspensive/react";
import type { ReactNode } from "react";

import { SkeletonView } from "@/shared/components";

import { NearLightningContent as NearLightningContentImpl } from "./NearLightningContent";
import { NearLightningContentErrorBoundary } from "./NearLightningContentErrorBoundary";
import { NearLightningSkeleton } from "../../../ui/nearby/NearLightningSkeleton";

type NearLightningContentProps = {
  header?: ReactNode;
  footer?: ReactNode;
};

function NearLightningSectionFallback({ hasHeader }: { hasHeader: boolean }) {
  return (
    <>
      {hasHeader ? (
        <div className="relative z-30 flex flex-row items-center justify-between gap-2 overflow-visible px-[24px]">
          <SkeletonView className="h-[28px] w-[240px] rounded-[8px]" />
        </div>
      ) : null}
      <NearLightningSkeleton />
    </>
  );
}

function NearLightningSectionReady({
  header,
  footer,
}: NearLightningContentProps) {
  return (
    <>
      {header}
      <NearLightningContentImpl />
      {footer}
    </>
  );
}

export function NearLightningContent({
  header,
  footer,
}: NearLightningContentProps) {
  return (
    <NearLightningContentErrorBoundary>
      <Suspense
        clientOnly
        fallback={<NearLightningSectionFallback hasHeader={header != null} />}
      >
        <NearLightningSectionReady header={header} footer={footer} />
      </Suspense>
    </NearLightningContentErrorBoundary>
  );
}
