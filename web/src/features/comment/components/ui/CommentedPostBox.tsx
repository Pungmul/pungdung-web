import { memo } from "react";
import Link from "next/link";

import { getTimeSincePosted } from "@/shared/lib";

import { MyComment } from "../../types";

function CommentedPostBoxComponent({ comment }: { comment: MyComment }) {
  const { timeSincePostedText } = getTimeSincePosted(comment.createdAt);

  return (
    <li>
      <Link
        href={{
          pathname: `/board/d/${comment.postId}`,
        }}
        className="relative w-full bg-background flex flex-col px-[28px] md:px-[32px] py-[24px] gap-[8px] hover:bg-grey-100 cursor-pointer"
      >
        <div className="relative flex flex-col gap-[12px] w-full overflow-hidden">
          <div className="text-[14px] text-grey-600 line-clamp-1 text-ellipsis">
            {comment.postTitle}
          </div>
          <div className="text-grey-800 text-[12px] line-clamp-2 text-ellipsis gap-[4px] flex flex-row">
            {comment.deleted ? (
              <>
                <span className="text-primary text-[14px]">└ </span>
                <b>삭제된 댓글입니다.</b>
              </>
            ) : (
              <>
                <span className="text-primary text-[14px]">└ </span>
                <p>{comment.content}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-[12px] items-center">
            <div className="flex flex-row items-center gap-1">
              <div className="flex size-6 items-center justify-center p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#FF7B7B"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                  />
                </svg>
              </div>
              <div className="text-[#FF7B7B] text-[12px]">
                {comment.likedNum}
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2  items-end">
            <div className="flex flex-row gap-1 items-center">
              <div className="text-grey-400 text-[12px]">
                {timeSincePostedText}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

export const CommentedPostBox = memo(CommentedPostBoxComponent);
