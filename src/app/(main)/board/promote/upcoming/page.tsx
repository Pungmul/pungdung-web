import { Metadata } from "next";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/core";

import { BoardHeader, boardQueries } from "@/features/board";
import { prefetchBoardInfoList } from "@/features/board";
import { UpcomingPerformanceList } from "@/features/promotion";

import UpcomingPromotionsBoundary from "./_UpcomingPromotionsBoundary";

export const metadata: Metadata = {
  title: "풍덩 | 관람 예정 공연",
  description: "관람 예정된 공연 목록 입니다.",
};

export const dynamic = "force-dynamic";

export default async function UpcomingPerformancePage() {

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    ...boardQueries.list(),
    queryFn: prefetchBoardInfoList,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="flex flex-col w-full h-full">
        <BoardHeader boardID={"upcoming-performance"} />
        <div className="flex flex-col w-full flex-grow relative items-center">
          <div className="w-full max-w-[768px]">
            <section key="upcoming-performance-list-section" className="relative h-full flex flex-col">
              <UpcomingPromotionsBoundary>
                <UpcomingPerformanceList />
              </UpcomingPromotionsBoundary>
            </section>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}