"use client";

import type { ReactNode } from "react";

import { PostBoxSkeleton } from "@/features/post";

import { ListEmptyView } from "@/shared/components";
import ObserveTrigger from "@/shared/components/ObserveTrigger";

import type { MyComment } from "../../types";
import { CommentedPostBox } from "../ui/CommentedPostBox";

interface CommentWithPostListProps {
  comments: MyComment[];
  isLoading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  ListEmptyComponent?: ReactNode;
}

const defaultListEmpty = (
  <ListEmptyView message="아직 작성한 댓글이 없어요." />
);

export function CommentWithPostList({
  comments,
  isLoading,
  hasNextPage,
  onLoadMore,
  ListEmptyComponent = defaultListEmpty,
}: CommentWithPostListProps) {
  if (!isLoading && comments.length === 0) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col">
        {ListEmptyComponent}
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-full flex-col">
      <ul className="flex list-none flex-col">
        {comments.map((comment) => (
          <CommentedPostBox comment={comment} key={comment.id} />
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
