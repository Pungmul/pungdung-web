import { Metadata } from "next";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/core";

import {
  BoardHeader,
  BoardListNav,
  boardQueries,
  prefetchBoardInfoList,
} from "@/features/board";

export const metadata: Metadata = {
  title: "풍덩 | 홍보 게시판",
};

export default async function BoardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    ...boardQueries.list(),
    queryFn: prefetchBoardInfoList
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="relative flex flex-col flex-grow">
        <BoardHeader boardID={"promote"} />
        <div className="flex flex-col w-full flex-grow relative">
          <div className="flex flex-row justify-center w-full h-full">
            <BoardListNav />
            <div className="w-full md:max-w-[768px] z-10">{children}</div>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
