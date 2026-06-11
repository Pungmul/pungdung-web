"use client";

import { useRef } from "react";

import {
  CommentComposer,
  CommentsList,
  CommentsThread,
  useCommentsListComposerState,
} from "@/features/comment";

import { Header, LinkChipButton, ListEmptyView } from "@/shared/components";
import { useBodyScrollLock, useViewportHeightVar } from "@/shared/hooks";
import { cn, useView } from "@/shared/lib";

import { PostContent } from "./PostContent";
import { PostMenu } from "./PostMenu";
import { usePostDetailPageViewModel } from "../../hooks/view-model";
import type { PostArticleDetail } from "../../types";
import { ReportPostModal } from "../overlay/ReportPostModal";
import { PostContentSkeleton } from "../ui/PostContentSkeleton";

export function PostDetailComponent({ postId }: { postId: number }) {
  const view = useView();
  const useMobileKeyboardShell = view !== "desktop";

  const mainRef = useRef<HTMLDivElement>(null);
  const composerState = useCommentsListComposerState();

  useViewportHeightVar(mainRef, {
    syncHtml: useMobileKeyboardShell,
    postDetailLayout: useMobileKeyboardShell,
  });
  useBodyScrollLock(useMobileKeyboardShell);

  const { post, isLoading, boardName, isWriter, isDeletedPostError } =
    usePostDetailPageViewModel(postId);

  const postBody = (
    <>
      <div className="h-4" />
      <PostDetailMainContent
        isLoading={isLoading}
        isDeletedPostError={isDeletedPostError}
        post={post}
      />
      <div className="h-4" />
    </>
  );

  const commentsSection =
    post && !isDeletedPostError && post.commentList ? (
      useMobileKeyboardShell ? (
        <CommentsThread
          comments={post.commentList}
          postId={post.postId}
          {...composerState}
        />
      ) : (
        <CommentsList comments={post.commentList} postId={post.postId} />
      )
    ) : null;

  if (useMobileKeyboardShell) {
    return (
      <div
        id="post-detail-main"
        ref={mainRef}
        className={cn(
          "mx-auto flex w-full max-w-[768px] flex-col",
          "h-[var(--app-height,100dvh)] min-h-0 overflow-hidden"
        )}
      >
        <Header
          title={boardName || ""}
          className="z-30 shrink-0"
          rightBtn={
            isDeletedPostError ? undefined : <PostMenu isWriter={isWriter} />
          }
        />

        <div
          ref={composerState.commentScrollRootRef}
          data-comment-scroll-root
          className="
            flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain
            [-webkit-overflow-scrolling:touch]
          "
        >
          <div className="flex flex-col bg-grey-100">
            {postBody}
            {commentsSection}
          </div>
        </div>

        {post && !isDeletedPostError && post.commentList && (
          <CommentComposer
            postId={post.postId}
            variant="anchored"
            {...composerState}
          />
        )}

        <ReportPostModal />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[768px] flex-col">
      <Header
        title={boardName || ""}
        className="z-30 shrink-0"
        rightBtn={
          isDeletedPostError ? undefined : <PostMenu isWriter={isWriter} />
        }
      />
      <article className="flex flex-grow flex-col">
        <div className="flex flex-grow flex-col bg-grey-100">
          {postBody}
          {commentsSection}
        </div>
      </article>
      <ReportPostModal />
    </div>
  );
}

function PostDetailMainContent({
  isLoading,
  isDeletedPostError,
  post,
}: {
  isLoading: boolean;
  isDeletedPostError: boolean;
  post: PostArticleDetail | null | undefined;
}) {
  if (isLoading) {
    return <PostContentSkeleton />;
  }
  if (isDeletedPostError) {
    return (
      <ListEmptyView
        message="삭제되었거나 볼 수 없는 게시글입니다."
        action={
          <LinkChipButton href="/board/main" filled>
            게시판으로
          </LinkChipButton>
        }
        className="min-h-[292px] bg-background"
      />
    );
  }
  if (!post) {
    return null;
  }
  return <PostContent post={post} fitMode="fit" />;
}
