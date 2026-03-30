import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/core";

import {
  BoardHeader,
  BoardListNav,
  boardQueries,
  prefetchBoardInfoList,
} from "@/features/board";

import { ScrollToTopButton } from "@/shared/components";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "풍덩 | 동아리 게시판",
};

export default async function ClubBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.fetchQuery({
    ...boardQueries.list(),
    queryFn: prefetchBoardInfoList,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="relative flex flex-grow flex-col">
        <BoardHeader boardID="club" searchable={false} />
        <ScrollToTopButton />
        <div className="relative flex flex-grow flex-col w-full">
          <div className="flex h-full w-full flex-row justify-center">
            <BoardListNav />
            <div className="z-10 w-full md:max-w-[768px]">{children}</div>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
