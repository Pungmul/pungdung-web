import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/core";

import {
  BoardHeader,
  BoardListNav,
  boardQueries,
  PostingButton,
  prefetchBoardInfoList,
} from "@/features/board";

import { ScrollToTopButton } from "@/shared/components";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ boardID: string }>;
}) {
  const { boardID } = await params;
  const boardList = await prefetchBoardInfoList();
  const boardName =
    boardList.find((board) => board.id === Number(boardID))?.name ||
    "알 수 없는 게시판";
  return {
    title: `풍덩 | ${boardName}`,
  };
}

export default async function BoardPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    boardID: string;
  }>;
}) {
  const { boardID: boardIdParam } = await params;

  const queryClient = getQueryClient();

  const boardList = await queryClient.fetchQuery({
    ...boardQueries.list(),
    queryFn: prefetchBoardInfoList,
  });

  const initialBoardInfo =
    boardList.find((board) => Number(board.id) === Number(boardIdParam)) ??
    null;

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="relative flex flex-grow flex-col">
        <BoardHeader
          boardID={boardIdParam}
          {...(initialBoardInfo
            ? {
                initialBoardInfo: {
                  name: initialBoardInfo.name,
                  description: initialBoardInfo.description,
                },
              }
            : {})}
        />
        <PostingButton boardID={Number(boardIdParam)} />
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
