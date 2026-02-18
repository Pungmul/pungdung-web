import React from "react";
import Link from "next/link";

import { CommentOutline, EyeIcon } from "@/shared/components/Icons";
import { getTimeSincePosted } from "@/shared/lib";

import { PostThumbnail } from "./PostThumbnail";
import type { PostSummary } from "../../types";

function PostBoxImpl({
  post,
  thumbnailPriority = false,
}: {
  post: PostSummary;
  thumbnailPriority?: boolean;
}) {
  const timeLabel = getTimeSincePosted(
    post.createdAt ?? new Date(Date.now() - post.timeSincePosted * 60_000)
  ).timeSincePostedText;

  return (
    <li>
      <Link
        key={post.postId}
        href={{
          pathname: `/board/d/${post.postId}`,
        }}
      >
        <article className="relative w-full bg-background flex flex-col px-[28px] md:px-[32px] py-[24px] gap-[8px] hover:bg-grey-100 cursor-pointer">
          <div className="relative w-full flex flex-row gap-[12px] items-center">
            <div className="relative flex flex-col gap-[4px] flex-grow overflow-hidden">
              <h2 className="text-[14px] line-clamp-1 text-ellipsis">
                {post.title}
              </h2>
              <div className="text-grey-400 text-[11px] max-w-24">
                {post.author == "Anonymous" ? "익명" : post.author}
              </div>
              <p className="text-grey-800 text-[12px] line-clamp-2 text-ellipsis py-[4px] whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
            {!!post.thumbnail && (
              <PostThumbnail
                imageData={post.thumbnail}
                priority={thumbnailPriority}
              />
            )}
          </div>

          <div className="flex flex-row items-center justify-between">
            <span className="flex flex-row gap-[12px] items-center">
              <div className="flex flex-row items-end gap-1">
                <div className="flex justify-center items-center size-5">
                  <EyeIcon className="text-grey-500" />
                </div>

                <div className="text-grey-400 text-[12px]">
                  {post.viewCount}
                </div>
              </div>
              <div className="flex flex-row items-end gap-1">
                <div className="flex justify-center items-center size-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#FF7B7B"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                    />
                  </svg>
                </div>
                <div className="text-[#FF7B7B] text-[12px]">
                  {post.likedNum}
                </div>
              </div>
              <div className="flex flex-row items-end gap-1">
                <div className="flex justify-center items-center size-5">
                  <CommentOutline className="text-grey-500" />
                </div>
                <div className="text-grey-500 text-[12px]">
                  {post.commentNum}
                </div>
              </div>
            </span>
            <span className="flex flex-row gap-2 items-end">
              <div className="flex flex-row gap-1 items-center">
                <span className="text-grey-400 text-[12px]">
                  {timeLabel}
                </span>
              </div>
            </span>
          </div>
        </article>
      </Link>
    </li>
  );
}

export const PostBox = React.memo(PostBoxImpl);
