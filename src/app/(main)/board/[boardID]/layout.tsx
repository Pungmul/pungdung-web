import { getQueryClient } from "@pThunder/core";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getInitialViewFromCookie } from "@pThunder/shared/lib/getInitialViewFromCookie";

import { loadBoardDetails, loadBoardInfoList } from "@/features/board/api";
import { BoardListNav, BoardHeader } from "@/features/board";
import PostingButton from "@pThunder/features/board/components/element/PostingButton";

export const revalidate = 1800; // 30분(초 단위)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ boardID: string }>;
}) {
  const { boardID } = await params;
  const boardList = await loadBoardInfoList();
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
  const { boardID } = await params;
  const initialView = await getInitialViewFromCookie();
  const queryClient = getQueryClient();
  const boardList = await loadBoardInfoList();
  const initialBoardInfo =
    boardList.find((board) => board.id === Number(boardID) || board.id === boardID) ??
    null;

  queryClient.setQueryData(["boardList"], boardList);
  queryClient.prefetchQuery({
    queryKey: ["board", boardID],
    queryFn: () => loadBoardDetails(Number(boardID)),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="relative flex flex-col flex-grow">
        <BoardHeader
          boardID={boardID}
          initialView={initialView === "desktop" ? "desktop" : "mobile"}
          {...(initialBoardInfo
            ? {
                initialBoardInfo: {
                  name: initialBoardInfo.name,
                  description: initialBoardInfo.description,
                },
              }
            : {})}
        />
        <PostingButton boardID={Number(boardID)} />
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
