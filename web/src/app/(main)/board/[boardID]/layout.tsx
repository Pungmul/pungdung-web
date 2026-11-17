import { Suspense } from "react";
import { cookies } from "next/headers";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/core";

import { hasAuthSessionCookie } from "@/features/auth";
import {
  BoardHeader,
  BoardLayoutTabs,
  BoardListNav,
  boardQueries,
  findBoardSummaryByRouteId,
  getBoardRscMetadataTitle,
  loadBoardInfoListResult,
  PostingButton,
} from "@/features/board";

import { ScrollToTopButton } from "@/shared/components";

import { loadBoardMetadata } from "@/features/board/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ boardID: string }>;
}) {
  const { boardID } = await params;
  return {
    title: await getBoardRscMetadataTitle(boardID),
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
  const cookieStore = await cookies();
  const isGuest = !hasAuthSessionCookie(
    cookieStore.get("accessToken")?.value,
    cookieStore.get("refreshToken")?.value
  );

  const numericBoardId = Number(boardIdParam);
  const accessToken = cookieStore.get("accessToken")?.value;

  return (
    <div className="relative flex flex-grow flex-col">
      <Suspense fallback={<div className="h-12 md:h-32" aria-hidden />}>
        <BoardHeaderSection boardId={boardIdParam} />
      </Suspense>
      <PostingButton boardID={numericBoardId} isGuest={isGuest} />
      <ScrollToTopButton />
      <div className="relative flex flex-grow flex-col w-full">
        <div className="flex h-full w-full flex-row justify-center">
          <BoardListNav isGuest={isGuest} />
          <div className="z-10 w-full md:max-w-[768px]">
            {Number.isFinite(numericBoardId) && (
              <Suspense fallback={null}>
                <BoardTabsSection boardId={numericBoardId} accessToken={accessToken} />
              </Suspense>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

async function BoardHeaderSection({ boardId }: { boardId: string }) {
  const queryClient = getQueryClient();
  const result = await loadBoardInfoListResult();
  if (result.ok) {
    queryClient.setQueryData(boardQueries.list().queryKey, result.data);
  }

  const initialBoardInfo = result.ok
    ? (findBoardSummaryByRouteId(result.data, boardId) ?? null)
    : null;

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <BoardHeader
        boardID={boardId}
        {...(initialBoardInfo
          ? { initialBoardInfo: { name: initialBoardInfo.name, description: initialBoardInfo.description } }
          : {})}
      />
    </HydrationBoundary>
  );
}

async function BoardTabsSection({
  boardId,
  accessToken,
}: {
  boardId: number;
  accessToken: string | undefined;
}) {
  const info = await loadBoardMetadata(boardId, accessToken);
  if (!info) {
    return <BoardLayoutTabs boardId={boardId} />;
  }
  const queryClient = getQueryClient();
  queryClient.setQueryData(boardQueries.boardInfo(boardId).queryKey, info);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BoardLayoutTabs boardId={boardId} />
    </HydrationBoundary>
  );
}
