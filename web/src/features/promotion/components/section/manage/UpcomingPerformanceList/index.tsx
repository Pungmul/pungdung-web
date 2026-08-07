"use client";

import { Suspense } from "@suspensive/react";
import type { ComponentProps } from "react";

import { UpcomingPerformanceList as UpcomingPerformanceListImpl } from "./UpcomingPerformanceList";
import { UpcomingPerformanceListErrorBoundary } from "./UpcomingPerformanceListErrorBoundary";
import { UpcomingPerformanceItemSkeleton } from "../../../ui/UpcomingPerformanceItemSkeleton";

export function UpcomingPerformanceList(
  props: ComponentProps<typeof UpcomingPerformanceListImpl>
) {
  return (
    <UpcomingPerformanceListErrorBoundary>
      <Suspense
        clientOnly
        fallback={
          <section className="flex w-full flex-col">
            <UpcomingPerformanceItemSkeleton length={8} />
          </section>
        }
      >
        <UpcomingPerformanceListImpl {...props} />
      </Suspense>
    </UpcomingPerformanceListErrorBoundary>
  );
}
