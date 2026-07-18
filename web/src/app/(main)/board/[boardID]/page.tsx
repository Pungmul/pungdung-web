import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { Suspense } from "@suspensive/react";

import { hasAuthSessionCookie } from "@/features/auth";
import { HotPostBannerSkeleton } from "@/features/board";
import { PostBoxSkeleton } from "@/features/post";

import { BoardDetailPage } from "./_BoardDetailPage";

export const dynamic = "force-dynamic";

type BoardPageProps = {
  params: Promise<{ boardID: string }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardID: boardIdParam } = await params;
  const cookieStore = await cookies();
  const numericBoardId = Number(boardIdParam);

  if (!Number.isFinite(numericBoardId)) {
    notFound();
  }

  return (
    <section className="relative flex w-full flex-col bg-background">
      <Suspense clientOnly fallback={<BoardByIdLoading />}>
        <BoardDetailPage
          boardId={numericBoardId}
          isGuest={
            !hasAuthSessionCookie(
              cookieStore.get("accessToken")?.value,
              cookieStore.get("refreshToken")?.value
            )
          }
        />
      </Suspense>
    </section>
  );
}

function BoardByIdLoading() {
  return (
    <React.Fragment>
      <div aria-busy aria-label="게시판 로딩">
        <HotPostBannerSkeleton />
      </div>
      <PostBoxSkeleton length={8} />
    </React.Fragment>
  );
}
