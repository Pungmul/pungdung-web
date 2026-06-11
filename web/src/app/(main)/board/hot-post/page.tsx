import { Suspense } from "@suspensive/react";

import { PostBoxSkeleton } from "@/features/post";

import { HotPostList } from "./_HotPostList";

export const dynamic = "force-dynamic";

export default async function HotPostPage() {
  return (
    <section
      key="hot-post-list-section"
      className="relative flex min-h-full w-full flex-col bg-background"
      >
        <Suspense clientOnly fallback={<PostBoxSkeleton length={8} />}>
        <HotPostList />
      </Suspense>
    </section>
  );
}
