import { cookies } from "next/headers";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/core";

import { hasAuthSessionCookie } from "@/features/auth";
import {
  BoardHeader,
  BoardListNav,
  boardQueries,
  findBoardSummaryByRouteId,
  getBoardRscMetadataTitle,
  loadBoardInfoListResult,
  PostingButton,
} from "@/features/board";

import { ScrollToTopButton } from "@/shared/components";

export const dynamic = "force-dynamic";

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

  const queryClient = getQueryClient();
  const result = await loadBoardInfoListResult();
  if (result.ok) {
    queryClient.setQueryData(boardQueries.list().queryKey, result.data);
  }

  const initialBoardInfo = result.ok
    ? (findBoardSummaryByRouteId(result.data, boardIdParam) ?? null)
    : null;

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
        <PostingButton
          boardID={Number(boardIdParam)}
          isGuest={isGuest}
        />
        <ScrollToTopButton />
        <div className="relative flex flex-grow flex-col w-full">
          <div className="flex h-full w-full flex-row justify-center">
            <BoardListNav isGuest={isGuest} />
            <div className="z-10 w-full md:max-w-[768px]">{children}</div>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
