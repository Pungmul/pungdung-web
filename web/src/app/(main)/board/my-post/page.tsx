import { Suspense } from "@suspensive/react";

import { PostBoxSkeleton } from "@/features/post";

import { MyPostListPage } from "./_MyPostListPage";

export default function MyPostPage() {
  return (
    <section key="my-post-section" className="relative flex h-full flex-col">
      <Suspense clientOnly fallback={<PostBoxSkeleton length={8} />}>
        <MyPostListPage />
      </Suspense>
    </section>
  );
}
