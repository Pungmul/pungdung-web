import React from "react";

import { Suspense } from "@suspensive/react";

import { HotPostBannerSkeleton } from "@/features/board";
import { PostBoxSkeleton } from "@/features/post";

import { ClubBoardPage } from "./_ClubBoardPage";

export const dynamic = "force-dynamic";

export default function ClubBoardRoutePage() {
  return (
    <section className="relative flex w-full flex-col bg-background">
      <Suspense clientOnly fallback={<ClubBoardLoading />}>
        <ClubBoardPage />
      </Suspense>
    </section>
  );
}

function ClubBoardLoading() {
  return (
    <React.Fragment>
      <div aria-busy aria-label="동아리 게시판 로딩">
        <HotPostBannerSkeleton />
      </div>
      <PostBoxSkeleton length={8} />
    </React.Fragment>
  );
}
