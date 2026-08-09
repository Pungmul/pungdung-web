import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { Suspense } from "@suspensive/react";

import { hasAuthSessionCookie } from "@/features/auth";
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
  const cookieStore = await cookies();

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
          isGuest={
            !hasAuthSessionCookie(
              cookieStore.get("accessToken")?.value,
              cookieStore.get("refreshToken")?.value
            )
          }
        />
      </Suspense>
    </div>
  );
}
