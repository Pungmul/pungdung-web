import { memo } from "react";
import Link from "next/link";

import { HandThumbUpIcon } from "@heroicons/react/24/outline";

import { CommentOutline, EyeIcon } from "@/shared/components/Icons";
import { getTimeSincePosted } from "@/shared/lib";

import { PostThumbnail } from "./PostThumbnail";
import type { PostSummaryWithCategory } from "../../types";

export const PostBoxWithCategory = memo(
  ({
    post,
    thumbnailPriority = false,
  }: {
    post: PostSummaryWithCategory;
    thumbnailPriority?: boolean;
  }) => {
    const timeLabel = getTimeSincePosted(
      post.createdAt ?? new Date(Date.now() - post.timeSincePosted * 60_000)
    ).timeSincePostedText;

    return (
      <Link
        key={post.postId}
        href={{
          pathname: `/board/d/${post.postId}`,
        }}
        className="relative w-full bg-background flex flex-col px-[28px] md:px-[32px] py-[24px] gap-[8px] hover:bg-grey-100 cursor-pointer"
      >
        <div className="relative w-full flex flex-row gap-[12px] items-center">
          <div className="relative flex flex-col gap-[12px] flex-grow overflow-hidden">
            <div className="px-[8px] py-[4px] bg-grey-100 rounded-[4px] text-grey-500 text-[12px] w-fit">
              {post.categoryName}
            </div>
            <div className="flex flex-col gap-[4px] items-start">
              <div className="text-[14px] line-clamp-1 text-ellipsis">
                {post.title}
              </div>
              <div className="text-grey-400 text-[11px] max-w-24">
                {post.author == "Anonymous" ? "익명" : post.author}
              </div>
            </div>
            <div className="text-grey-800 text-[12px] line-clamp-2 text-ellipsis">
              {post.content}
            </div>
          </div>
          {post.thumbnail && (
            <PostThumbnail
              imageData={post.thumbnail}
              priority={thumbnailPriority}
            />
          )}
        </div>

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-[12px] items-center">
            <div className="flex flex-row items-center gap-1">
              <div className="flex size-6 items-center justify-center p-1">
                <EyeIcon className="size-full text-grey-500" />
              </div>

              <div className="text-grey-400 text-[12px]">{post.viewCount}</div>
            </div>
            <div className="flex flex-row items-center gap-1">
              <div className="flex size-6 items-center justify-center p-1">
                <HandThumbUpIcon className="size-full text-red-500" />
              </div>
              <div className="text-red-500 text-[12px]">{post.likedNum}</div>
            </div>
            <div className="flex flex-row items-center gap-1">
              <div className="flex size-6 items-center justify-center p-1">
                <CommentOutline className="size-full text-grey-500" />
              </div>
              <div className="text-grey-500 text-[12px]">{post.commentNum}</div>
            </div>
          </div>
          <div className="flex flex-row gap-2  items-end">
            <div className="flex flex-row gap-1 items-center">
              <div className="text-grey-400 text-[12px]">{timeLabel}</div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
);

PostBoxWithCategory.displayName = "PostBoxWithCategory";
