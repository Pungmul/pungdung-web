"use client";

import { PostDetailComponent as PostDetailComponentImpl } from "./PostDetailComponent";
import { PostDetailComponentErrorBoundary } from "./PostDetailComponentErrorBoundary";

export function PostDetailComponent({
  postId,
  isGuest,
}: {
  postId: number;
  isGuest: boolean;
}) {
  return (
    <PostDetailComponentErrorBoundary>
      <PostDetailComponentImpl postId={postId} isGuest={isGuest} />
    </PostDetailComponentErrorBoundary>
  );
}
