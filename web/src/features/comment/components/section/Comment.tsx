import { HandThumbUpIcon } from "@heroicons/react/24/outline";

import { cn } from "@/shared";
import { CommentOutline } from "@/shared/components/Icons";

import { CommentMenu } from "./CommentMenu";
import {
  useCommentLikeAcknowledgement,
  useCommentReplyPrompt,
} from "../../hooks/actions";
import type { Comment as CommentType } from "../../types";

const Comment = ({
  comment,
  replyTarget,
  setReplyTarget,
  composerTextareaRef,
  applyComposerFocusRef,
}: {
  comment: CommentType;
  replyTarget: CommentType | null;
  setReplyTarget: (comment: CommentType) => void;
  composerTextareaRef: React.RefObject<HTMLTextAreaElement | null>;
  applyComposerFocusRef: React.RefObject<(() => boolean) | null>;
}) => {
  // 대댓글: 확인 후 입력 포커스·답글 대상으로 등록
  const handleReplyClick = useCommentReplyPrompt({
    comment,
    composerTextareaRef,
    applyComposerFocusRef,
    setReplyTarget,
  });
  // 추천: 확인 후 서버 토글
  const handleLikeClick = useCommentLikeAcknowledgement({
    commentId: comment.commentId,
    postId: comment.postId,
    content: comment.content,
  });

  return (
    <div
      className={
        cn("w-full p-5 md:px-6 gap-[8px] flex flex-col bg-background",
          replyTarget?.commentId == comment.commentId && "bg-red-100")
      }
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center text-[12px] md:text-[13px]">
          <div className="text-grey-800 truncate">
            {comment.userName}
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div
            className="flex h-7 items-center cursor-pointer px-1 gap-0.5"
            onClick={handleLikeClick}
          >
            <HandThumbUpIcon className="size-5 text-red-500" />
            {comment.likedNum > 0 ? (
              <span className="text-red-300 leading-6 text-[13px]">
                {comment.likedNum}
              </span>
            ) : null}
          </div>
          <div
            className="size-7 p-1 cursor-pointer flex items-center justify-center"
            onClick={handleReplyClick}
          >
            <CommentOutline className="size-full text-grey-400" />
          </div>
          <div className="size-7 p-1 cursor-pointer">
            <CommentMenu comment={comment} />
          </div>
        </div>
      </div>
      <div className="text-[13px] md:text-[15px] text-grey-800 whitespace-pre-wrap">
        {comment.content}
      </div>
      <div className="text-grey-400 text-[12px]">{comment.createdAt}</div>
    </div>
  );
};

export { Comment };
