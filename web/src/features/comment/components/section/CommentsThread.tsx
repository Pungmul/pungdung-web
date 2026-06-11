"use client";

import { useMemo } from "react";

import { Space } from "@/shared";

import { Comment } from "./Comment";
import { Reply } from "./Reply";
import type { useCommentsListComposerState } from "../../hooks/state/useCommentsListComposerState";
import { buildCommentTree } from "../../lib";
import type { Comment as CommentType } from "../../types";

type CommentsListComposerState = ReturnType<typeof useCommentsListComposerState>;

export type CommentsThreadProps = {
  comments: CommentType[];
  postId: number;
} & CommentsListComposerState;

export function CommentsThread({
  comments,
  replyTarget,
  setReplyTarget,
  commentAnchorElementsRef,
  composerTextareaRef,
  applyComposerFocusRef,
}: CommentsThreadProps) {
  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);

  return (
    <div className="flex w-full flex-col bg-grey-100">
      {commentTree.map((comment) => (
        <div
          ref={(element) => {
            commentAnchorElementsRef.current[comment.commentId] = element;
          }}
          key={comment.commentId}
          id={comment.commentId.toString()}
          className="w-full bg-background"
        >
          <Comment
            comment={comment}
            replyTarget={replyTarget}
            setReplyTarget={setReplyTarget}
            composerTextareaRef={composerTextareaRef}
            applyComposerFocusRef={applyComposerFocusRef}
          />
          <div className="flex w-full flex-col">
            {comment.replies?.map((reply) => (
              <Reply key={reply.commentId} reply={reply} />
            ))}
          </div>
        </div>
      ))}
      {/* replyTarget 있을 경우 댓글 입력 필드 위에 공간 추가 */}
      {replyTarget && <Space h={32} />}
    </div>
  );
}
