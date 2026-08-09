import { Metadata } from "next";
import { cookies } from "next/headers";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/core";

import { hasAuthSessionCookie } from "@/features/auth";
import {
  BoardHeader,
  BoardListNav,
  boardQueries,
  loadBoardInfoListResult,
} from "@/features/board";

import { ScrollToTopButton } from "@/shared/components";

export const metadata: Metadata = {
  title: "풍덩 | 인기 게시글",
};

export default async function BoardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex h-full w-full flex-col">
      <HydrationBoundary state={dehydratedState}>
        <BoardHeader boardID={"hot-post"} />
        <ScrollToTopButton />
        <div className="relative flex flex-grow flex-col items-center w-full">
          <div className="flex h-full w-full flex-row justify-center">
            <BoardListNav isGuest={isGuest} />
            <div className="z-10 w-full md:max-w-[768px]">{children}</div>
          </div>
        </div>
      </HydrationBoundary>
    </div>
  );
}
