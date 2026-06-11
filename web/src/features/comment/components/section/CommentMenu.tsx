"use client";

import { useRef } from "react";

import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

import {
  useAnchorDropdownPlacement,
  useClickOutside,
} from "@/shared/hooks";

import {
  useCommentMenuDelete,
  useCommentMenuReportOpen,
} from "../../hooks/actions";
import { useCommentMenuOpen } from "../../hooks/state";
import type { Comment as CommentType, Reply as ReplyType } from "../../types";

/** 위로 펼칠 때 메뉴 패널 높이에 맞춘 앵커 오프셋(px) */
const COMMENT_MENU_PANEL_OFFSET_PX = 112;

interface CommentMenuProps {
  comment: CommentType | ReplyType;
}

export function CommentMenu({ comment }: CommentMenuProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  // 케밥 메뉴 열림 + 토글
  const { isOpen, close, toggle } = useCommentMenuOpen();

  // 뷰포트 하단에 가까우면 위로 펼침, 앵커가 화면 밖이면 닫기
  const { openUpward } = useAnchorDropdownPlacement({
    anchorRef: targetRef,
    enabled: isOpen,
    onAnchorOutsideViewport: close,
    throttleMs: 1000,
  });

  // 삭제·신고: 각각 mutation/모달과 연결 (메뉴 닫기는 신고 쪽에서 공유)
  const handleDeleteClick = useCommentMenuDelete({
    commentId: comment.commentId,
    postId: comment.postId,
  });
  const handleReportClick = useCommentMenuReportOpen(comment, close);

  // 열린 상태일 때 패널 바깥 클릭으로 닫기
  useClickOutside({
    ref: targetRef,
    enabled: isOpen,
    onOutsideClick: close,
  });

  return (
    <>
      <div
        ref={targetRef}
        className={
          "relative select-none cursor-pointer w-full h-full flex justify-center items-center"
        }
        onClick={toggle}
      >
        <EllipsisVerticalIcon className="size-full text-grey-800" />
        {isOpen && (
          <ul
            className={`absolute right-0 px-3 py-2 border border-grey-200 bg-background rounded-sm flex flex-col gap-2 z-10 ${openUpward ? "mb-1" : "top-full mt-1"
              }`}
            style={
              openUpward ? { top: -COMMENT_MENU_PANEL_OFFSET_PX } : undefined
            }
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <li
              className="w-12 text-right text-grey-800"
              onClick={handleReportClick}
            >
              신고
            </li>
            <li
              className="w-12 text-right text-red-400"
              onClick={handleDeleteClick}
            >
              삭제
            </li>
          </ul>
        )}
      </div>
    </>
  );
}
