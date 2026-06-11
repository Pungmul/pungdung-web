import { Metadata } from "next";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/core";

import {
  BoardHeader,
  BoardListNav,
  boardQueries,
  prefetchBoardInfoList,
} from "@/features/board";

import { ScrollToTopButton } from "@/shared/components";

export const metadata: Metadata = {
  title: "풍덩 | 내 댓글",
  description: "내가 작성한 댓글 목록 입니다.",
};

export default async function MyCommentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    ...boardQueries.list(),
    queryFn: prefetchBoardInfoList,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex h-full w-full flex-col">
      <HydrationBoundary state={dehydratedState}>
        <BoardHeader boardID={"my-comment"} />
        <ScrollToTopButton />
        <div className="relative flex flex-grow flex-col items-center w-full">
          <div className="flex h-full w-full flex-row justify-center">
            <BoardListNav />
            <div className="w-full max-w-[768px]">{children}</div>
          </div>
        </div>
      </HydrationBoundary>
    </div>
  );
}
