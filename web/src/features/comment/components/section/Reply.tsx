import { HandThumbUpIcon } from "@heroicons/react/24/outline";

import { CommentMenu } from "./CommentMenu";
import { useCommentLikeAcknowledgement } from "../../hooks/actions";
import type { Reply as ReplyType } from "../../types";

const Reply = ({ reply }: { reply: ReplyType }) => {
  // 추천: 확인 다이얼로그·토스트 (댓글과 동일 UX)
  const handleLikeClick = useCommentLikeAcknowledgement({
    content: reply.content,
    confirmMessage: "이 대댓글을 추천하시겠습니까?",
  });

  return (
    <div className="w-full py-5 pl-8 pr-5 md:pr-6 bg-grey-100 gap-[8px] flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center text-[12px] md:text-[13px]">
          <div className="text-grey-800 max-w-20 truncate">
            {reply.userName}
          </div>
          <div className="text-grey-400">{reply.createdAt}</div>
        </div>
        <div className="flex flex-row items-center cursor-pointer">
          <div
            className="size-7 p-1 cursor-pointer flex items-center justify-center"
            onClick={handleLikeClick}
          >
            <HandThumbUpIcon className="size-full text-red-500" />
          </div>
          <div className="size-7 p-1 cursor-pointer">
            <CommentMenu comment={reply} />
          </div>
        </div>
      </div>
      <div className="text-[13px] md:text-[15px] text-grey-800">
        {reply.content}
      </div>
    </div>
  );
};

export { Reply };
