"use client";

import { memo } from "react";

import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

import { useLoginRequiredConfirmAction } from "@/features/auth";

import { WebViewLink } from "@/shared/components";

import { getBoardRoute } from "../../../lib";
import type { BoardSummary } from "../../../types";

type BoardListItemProps = {
  isBookmarked: boolean;
  board: BoardSummary;
  toggleBookmark: (board: BoardSummary) => void;
  isGuest: boolean;
};

export const BoardListItem = memo(function BoardListItem({
  isBookmarked,
  board,
  toggleBookmark,
  isGuest,
}: BoardListItemProps) {
  const { requestLogin } = useLoginRequiredConfirmAction();
  const { isPublic } = board;

  return (
    <li className="w-full px-[12px] py-[8px] flex flex-row items-center gap-[8px]">
      <div
        className="flex size-7 cursor-pointer items-center justify-center p-0.5"
        onClick={(e) => {
          e.stopPropagation();
          toggleBookmark(board);
        }}
      >
        {isBookmarked ? (
          <span className="flex size-full items-center justify-center">
            <StarIconSolid className="size-full" color="#ffadad" />
          </span>
        ) : (
          <span className="flex size-full items-center justify-center">
            <StarIconOutline className="size-full" color="#ffadad" />
          </span>
        )}
      </div>
      <div
        className="flex-grow"
        onClickCapture={(event) => {
          if (!isGuest || isPublic) return;

          event.preventDefault();
          event.stopPropagation();
          requestLogin();
        }}
        onKeyDownCapture={(event) => {
          if (
            !isGuest ||
            isPublic ||
            (event.key !== "Enter" && event.key !== " ")
          ) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();
          requestLogin();
        }}
      >
        <WebViewLink
          href={getBoardRoute(board.id)}
          className="text-[15px] leading-7 text-grey-600"
          prefetch
        >
          {board.name}
        </WebViewLink>
      </div>
    </li>
  );
});
