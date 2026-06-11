import React from "react";
import { notFound } from "next/navigation";

import { Suspense } from "@suspensive/react";

import { HotPostBannerSkeleton } from "@/features/board";
import { PostBoxSkeleton } from "@/features/post";

import { BoardDetailPage } from "./_BoardDetailPage";

export const dynamic = "force-dynamic";

type BoardPageProps = {
  params: Promise<{ boardID: string }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardID: boardIdParam } = await params;
  const numericBoardId = Number(boardIdParam);

  if (!Number.isFinite(numericBoardId)) {
    notFound();
  }

  return (
    <section className="relative flex w-full flex-col bg-background">
      <Suspense clientOnly fallback={<BoardByIdLoading />}>
        <BoardDetailPage boardId={numericBoardId} />
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
