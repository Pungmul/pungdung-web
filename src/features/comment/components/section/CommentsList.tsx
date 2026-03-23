"use client";

import { CommentComposer } from "./CommentComposer";
import { CommentsThread } from "./CommentsThread";
import { useCommentsListComposerState } from "../../hooks/state";
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
  const composerState = useCommentsListComposerState();

  return (
    <>
      <div className="flex h-full w-full flex-grow flex-col bg-grey-100">
        <div className="flex flex-grow flex-col">
          <CommentsThread
            comments={comments}
            postId={postId}
            {...composerState}
          />
        </div>

        <CommentComposer
          postId={postId}
          variant="sticky"
          {...composerState}
        />
      </div>
      <ReportCommentModal />
    </>
  );
};
