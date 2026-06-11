import { Suspense } from "@suspensive/react";

import { PostBoxSkeleton } from "@/features/post";

import { MyCommentListPage } from "./_MyCommentListPage";

export default function MyCommentPage() {
  return (
    <section key="my-comment-section" className="relative flex h-full flex-col">
      <Suspense clientOnly fallback={<PostBoxSkeleton length={8} />}>
        <MyCommentListPage />
      </Suspense>
    </section>
  );
}
