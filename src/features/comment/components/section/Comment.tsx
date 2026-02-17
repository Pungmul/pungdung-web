import { HandThumbUpIcon } from "@heroicons/react/24/outline";

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
}: {
  comment: CommentType;
  replyTarget: CommentType | null;
  setReplyTarget: (comment: CommentType) => void;
  composerTextareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) => {
  // 대댓글: 확인 후 입력 포커스·답글 대상으로 등록
  const handleReplyClick = useCommentReplyPrompt({
    comment,
    composerTextareaRef,
    setReplyTarget,
  });
  // 추천: 확인 다이얼로그·토스트 (현재 서버 mutation 없음)
  const handleLikeClick = useCommentLikeAcknowledgement({
    content: comment.content,
  });

  return (
    <div
      className={
        "w-full p-5 md:px-6 gap-[8px] flex flex-col border-b border-b-grey-300 " +
        (replyTarget?.commentId == comment.commentId
          ? " bg-red-100"
          : " bg-background")
      }
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center text-[12px] md:text-[13px]">
          <div className="text-grey-800 max-w-20 truncate">
            {comment.userName}
          </div>
          <div className="text-grey-400">{comment.createdAt}</div>
        </div>
        <div className="flex flex-row items-center">
          <div
            className="size-7 p-1 cursor-pointer flex items-center justify-center"
            onClick={handleReplyClick}
          >
            <CommentOutline className="text-grey-400" />
          </div>
          <div
            className="size-7 p-1 cursor-pointer flex items-center justify-center"
            onClick={handleLikeClick}
          >
            <HandThumbUpIcon className="text-red-500" />
          </div>
          <div className="size-7 p-1 cursor-pointer">
            <CommentMenu comment={comment} />
          </div>
        </div>
      </div>
      <div className="text-[13px] md:text-[15px] text-grey-800 whitespace-pre-wrap">
        {comment.content}
      </div>
    </div>
  );
};

export { Comment };
