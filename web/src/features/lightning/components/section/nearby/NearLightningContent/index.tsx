"use client";

import { Suspense } from "@suspensive/react";

import { NearLightningContent as NearLightningContentImpl } from "./NearLightningContent";
import { NearLightningContentErrorBoundary } from "./NearLightningContentErrorBoundary";
import { NearLightningSkeleton } from "../../../ui/nearby/NearLightningSkeleton";

export function NearLightningContent() {
  return (
    <NearLightningContentErrorBoundary>
      <Suspense clientOnly fallback={<NearLightningSkeleton />}>
        <NearLightningContentImpl />
      </Suspense>
    </NearLightningContentErrorBoundary>
  );
}
