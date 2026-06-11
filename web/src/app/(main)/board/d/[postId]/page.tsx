import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Suspense } from "@suspensive/react";

import { getQueryClient } from "@/core";

import { boardQueries, prefetchBoardInfoList } from "@/features/board";
import { PostContentSkeleton, PostDetailComponent } from "@/features/post";

import { Header } from "@/shared";

export const metadata: Metadata = {
  title: "풍덩 | 게시글 상세",
};

export default async function Page({
  params,
}: {
  params: Promise<{ postId?: string | number }>;
}) {
  const { postId } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    ...boardQueries.list(),
    queryFn: prefetchBoardInfoList,
  });

  if (!postId) {
    return notFound();
  }

  return (
    <div className="relative w-full h-full flex-grow bg-grey-100">
      <Suspense
        clientOnly
        fallback={
          <div className="w-full h-full bg-grey-100 max-w-[768px] mx-auto">
            <Header title="" isBackBtn={false} />
            <PostContentSkeleton />
          </div>
        }
      >
        <PostDetailComponent
          postId={Number(postId)}
        />
      </Suspense>
    </div>
  );
}
