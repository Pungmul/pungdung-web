"use client";

import { useMemo, useRef, useState } from "react";

import { Comment } from "./Comment";
import { CommentComposer } from "./CommentComposer";
import { Reply } from "./Reply";
import { buildCommentTree } from "../../lib";
import type { Comment as CommentType } from "../../types";
import { ReportCommentModal } from "../overlay/ReportCommentModal";

interface CommentsListProps {
  comments: CommentType[];
  postId: number;
}

export const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  postId,
}) => {
  const [replyTarget, setReplyTarget] = useState<CommentType | null>(null);
  /** 행 루트 DOM — 하단 입력의 답글 배너에서 scrollIntoView용 */
  const commentAnchorElementsRef = useRef<
    Record<number, HTMLDivElement | null>
  >({});
  const composerTextareaRef = useRef<HTMLTextAreaElement>(null);

  const commentTree = useMemo(
    () => buildCommentTree(comments),
    [comments]
  );

  return (
    <>
      <div className="w-full flex-col flex flex-grow h-full bg-grey-100">
        <div className="flex-col flex flex-grow">
          {commentTree.map((comment) => (
            <div
              ref={(el) => {
                commentAnchorElementsRef.current[comment.commentId] = el;
              }}
              key={comment.commentId}
              id={comment.commentId.toString()}
              className="w-full bg-background "
            >
              <Comment
                comment={comment}
                replyTarget={replyTarget}
                setReplyTarget={setReplyTarget}
                composerTextareaRef={composerTextareaRef}
              />
              <div className="w-full flex-col flex">
                {comment.replies?.map((reply) => (
                  <Reply key={reply.commentId} reply={reply} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <CommentComposer
          postId={postId}
          replyTarget={replyTarget}
          setReplyTarget={setReplyTarget}
          commentAnchorElementsRef={commentAnchorElementsRef}
          composerTextareaRef={composerTextareaRef}
        />
      </div>
      <ReportCommentModal />
    </>
  );
};
