import { Suspense } from "react";

import { PostBoxSkeleton } from "@/features/post";
import { UpcomingPerformanceList } from "@/features/promote";

export const dynamic = "force-dynamic";

export default function UpcomingPerformancePage() {
  return (
    <section key="upcoming-performance-list-section" className="relative h-full flex flex-col">
      <Suspense fallback={<PostBoxSkeleton length={8} />}>
        <UpcomingPerformanceList />
      </Suspense>
    </section>
  );
}
