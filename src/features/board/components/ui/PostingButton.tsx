"use client";

import Link from "next/link";

import { PencilIcon } from "@heroicons/react/24/outline";

import { useScrollHideComponent } from "@/shared";

export function PostingButton({ boardID }: { boardID: number | "promote" }) {
  // 스크롤 방향에 따라 하단 작성 버튼 표시 토글
  const { componentRef, isVisible } = useScrollHideComponent();

  return (
    <div
      ref={componentRef}
      className={`fixed pointer-events-none bottom-3 flex justify-center w-full p-2 z-30 transition-transform duration-500 will-change-transform ${
        isVisible ? "translate-y-0" : "translate-y-[120%]"
      }`}
    >
      <Link
        className="pointer-events-auto px-3 py-2 bg-background rounded-full flex items-center justify-center border border-grey-300 shadow-md"
        href={{
          pathname: `/board/p`,
          query: {
            boardId: boardID,
          },
        }}
        scroll={false}
      >
        <div className="text-[14px] text-grey-800">게시글 작성</div>
        <div
          className="flex justify-center items-center size-6 p-1"
        >
          <PencilIcon className="size-full text-primary" />
        </div>
      </Link>
    </div>
  );
}
