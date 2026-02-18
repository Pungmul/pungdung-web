"use client";

import type { ReactNode } from "react";

import { ListEmptyView } from "@/shared/components";
import ObserveTrigger from "@/shared/components/ObserveTrigger";

import type { PostSummary } from "../../types";
import { PostBox } from "../ui/PostBox";
import { PostBoxSkeleton } from "../ui/PostBoxSkeleton";

interface PostListProps {
  posts: PostSummary[];
  isLoading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  ListEmptyComponent?: ReactNode;
}

const defaultListEmpty = (
  <ListEmptyView message="아직 게시글이 없습니다" />
);

export function PostList({
  posts,
  isLoading,
  hasNextPage,
  onLoadMore,
  ListEmptyComponent = defaultListEmpty,
}: PostListProps) {
  if (!isLoading && posts.length === 0) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col">
        {ListEmptyComponent}
      </div>
    );
  }
  const firstThumbnailIndex = posts.findIndex((post) => post.thumbnail);

  return (
    <div className="flex flex-col w-full max-w-full">
      <ul className="flex flex-col list-none">
        {posts.map((post, index) => (
          <PostBox
            post={post}
            key={post.postId}
            thumbnailPriority={
              Boolean(post.thumbnail) && index === firstThumbnailIndex
            }
          />
        ))}
        {isLoading && <PostBoxSkeleton length={3} />}
        <li>
          <ObserveTrigger
            trigger={onLoadMore}
            unmountCondition={!hasNextPage}
            triggerCondition={{
              rootMargin: "0px 0px 60px 0px",
            }}
          />
        </li>
      </ul>
    </div>
  );
}
