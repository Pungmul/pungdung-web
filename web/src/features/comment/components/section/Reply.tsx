import { HandThumbUpIcon } from "@heroicons/react/24/outline";

import { CommentMenu } from "./CommentMenu";
import { useCommentLikeAcknowledgement } from "../../hooks/actions";
import type { Reply as ReplyType } from "../../types";

const Reply = ({ reply }: { reply: ReplyType }) => {
  // 추천: 확인 후 서버 토글
  const handleLikeClick = useCommentLikeAcknowledgement({
    commentId: reply.commentId,
    postId: reply.postId,
    content: reply.content,
    confirmMessage: "이 대댓글을 추천하시겠습니까?",
  });

  return (
    <div className="w-full py-5 pl-8 pr-5 md:pr-6 bg-grey-100 gap-[8px] flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center text-[12px] md:text-[13px]">
          <div className="text-grey-800 truncate">
            {reply.userName}
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div
            className="flex h-7 items-center cursor-pointer px-1 gap-0.5"
            onClick={handleLikeClick}
          >
            <HandThumbUpIcon className="size-5 text-red-500" />
            {reply.likedNum > 0 ? (
              <span className="text-red-300 leading-6 text-[13px]">
                {reply.likedNum}
              </span>
            ) : null}
          </div>
          <div className="size-7 p-1 cursor-pointer">
            <CommentMenu comment={reply} />
          </div>
        </div>
      </div>
      <div className="text-[13px] md:text-[15px] text-grey-800">
        {reply.content}
      </div>
      <div className="text-grey-400 text-[12px]">{reply.createdAt}</div>
    </div>
  );
};

export { Reply };
