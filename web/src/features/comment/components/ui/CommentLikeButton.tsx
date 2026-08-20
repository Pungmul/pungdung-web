"use client";

import { HandThumbUpIcon as HandThumbUpIconOutline } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpIconSolid } from "@heroicons/react/24/solid";
import type { MouseEvent } from "react";

export function CommentLikeButton({
  likedNum,
  isLiked,
  ariaLabel,
  onClick,
}: {
  likedNum: number;
  isLiked: boolean;
  ariaLabel: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isLiked}
      className="flex h-7 items-center px-1 gap-0.5"
      onClick={onClick}
    >
      {isLiked ? (
        <HandThumbUpIconSolid className="size-5 text-red-500" aria-hidden />
      ) : (
        <HandThumbUpIconOutline className="size-5 text-red-500" aria-hidden />
      )}
      {likedNum > 0 ? (
        <span className="text-red-300 leading-6 text-[13px]">{likedNum}</span>
      ) : null}
    </button>
  );
}
