"use client";

import Link from "next/link";

import { FireIcon } from "@heroicons/react/24/outline";

import type { HotPostBannerPost } from "../../types";

interface HotPostBannerProps {
  hotPost: HotPostBannerPost | null;
}

export function HotPostBanner({ hotPost }: HotPostBannerProps) {
  const content = (
    <div className="bg-red-50 flex flex-row w-full px-[12px] py-[8px] rounded-full items-center gap-2 overflow-hidden">
      <span className="flex size-6 items-center justify-center">
        <FireIcon
          className="size-full"
          style={{
            color: hotPost ? "#FF4C4C" : "#C6C8CC",
          }}
        />
      </span>
      <div
        className={
          "text-md font-medium line-clamp-1 text-ellipsis " +
          (hotPost ? "text-grey-700" : "text-grey-400")
        }
      >
        {hotPost?.title || "핫한 게시글이 없습니다."}
      </div>
    </div>
  );

  return (
    <div className="w-full px-[16px] h-[64px] flex items-center gap-2 flex-row bg-grey-100 md:bg-transparent">
      {hotPost ? (
        <Link href={`/board/d/${hotPost.postId}`} className="w-full">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}
