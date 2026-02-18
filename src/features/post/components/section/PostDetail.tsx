"use client";

import { CommentsList } from "@/features/comment";

import { Header, LinkChipButton, ListEmptyView } from "@/shared/components";

import { PostContent } from "./PostContent";
import { PostMenu } from "./PostMenu";
import { usePostDetailPageViewModel } from "../../hooks/view-model";
import type { PostArticleDetail } from "../../types";
import { ReportPostModal } from "../overlay/ReportPostModal";
import { PostContentSkeleton } from "../ui/PostContentSkeleton";

export function PostDetailComponent({ postId }: { postId: number }) {
  // 상세 본문·보드명·작성자 여부(헤더 메뉴)·문서 제목
  const { post, isLoading, boardName, isWriter, isDeletedPostError } =
    usePostDetailPageViewModel(postId);

  return (
    <div className="min-h-full w-full md:max-w-[768px] mx-auto flex flex-col">
      <Header
        title={boardName || ""}
        className="flex-shrink-0 z-30"
        rightBtn={
          isDeletedPostError ? undefined : <PostMenu isWriter={isWriter} />
        }
      />
      <article className="flex flex-col flex-grow">
        <div className="flex-grow flex flex-col bg-grey-100">
          <div className="h-4" />
          <PostDetailMainContent
            isLoading={isLoading}
            isDeletedPostError={isDeletedPostError}
            post={post}
          />
          <div className="h-4" />
          <PostCommentList
            post={post}
            isDeletedPostError={isDeletedPostError}
          />
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

function PostCommentList({
  post,
  isDeletedPostError,
}: {
  post: PostArticleDetail | null | undefined;
  isDeletedPostError: boolean;
}) {
  if (!post || isDeletedPostError || !post.commentList) {
    return null;
  }
  return <CommentsList comments={post.commentList} postId={post.postId} />;
}