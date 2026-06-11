import React from "react";
import Link from "next/link";

import { HandThumbUpIcon } from "@heroicons/react/24/outline";

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
                <div className="flex size-4 items-center justify-center">
                  <EyeIcon className="size-full text-grey-500" />
                </div>

                <div className="text-grey-400 text-[12px]">
                  {post.viewCount}
                </div>
              </div>
              <div className="flex flex-row items-end gap-1">
                <div className="flex size-4 items-center justify-center">
                  <HandThumbUpIcon className="size-full text-red-500" />
                </div>
                <div className="text-red-500 text-[12px]">
                  {post.likedNum}
                </div>
              </div>
              <div className="flex flex-row items-end gap-1">
                <div className="flex size-4 items-center justify-center">
                  <CommentOutline className="size-full text-grey-500" />
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
