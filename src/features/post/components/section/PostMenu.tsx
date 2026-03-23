"use client";

import React, { memo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

import { useClickOutside } from "@/shared/hooks";
import { alertStore } from "@/shared/store";

import { useDeletePostAction } from "../../hooks/actions";
import { useReportPost } from "../../hooks/state";
import { postQueries } from "../../queries";

function PostMenuImpl({ isWriter }: { isWriter: boolean }) {
  // 현재 상세 글 id·수정 화면 이동용 라우팅
  const router = useRouter();
  const { postId: postIdParam } = useParams<{ postId: string }>();

  // 케밥 메뉴: 열림 상태 + 바깥 클릭 시 닫기
  const [isOpen, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside({
    ref: containerRef,
    enabled: isOpen,
    onOutsideClick: () => setOpen(false),
  });

  // 신고 모달: 제목·작성자는 상세 쿼리 데이터로 채운다
  const { data: postDetail } = useQuery(
    postQueries.detail(postIdParam ? Number(postIdParam) : null)
  );
  const { openModalToReport } = useReportPost();

  // 삭제: 서버 mutation + 확인 다이얼로그
  const { mutate: deletePost } = useDeletePostAction();
  const Alert = alertStore();

  const handleReportClick = () => {
    if (!postDetail || !postIdParam) return;

    openModalToReport({
      postId: Number(postIdParam),
      title: postDetail.title,
      author: postDetail.author,
    });
    setOpen(false);
  };

  const handleDeletePost = () => {
    deletePost({ postId: Number(postIdParam) });
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative select-none cursor-pointer"
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <span className="size-8 flex items-center justify-center">
          <EllipsisVerticalIcon className="size-full" />
        </span>
        {isOpen && (
          <ul
            className="absolute right-0 top-full px-3 py-2 border border-grey-300 mt-2 bg-background rounded-sm flex flex-col gap-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {isWriter && (
              <li
                className="w-12 text-right"
                onClick={() => {
                  if (!postIdParam) return;
                  const currentParams = new URLSearchParams(
                    window.location.search
                  );
                  currentParams.set("documentId", postIdParam);
                  router.push(`/board/p?${currentParams.toString()}`, {
                    scroll: false,
                  });
                }}
              >
                수정
              </li>
            )}
            {!isWriter && (
              <li className="w-12 text-right" onClick={handleReportClick}>
                신고
              </li>
            )}
            {isWriter && (
              <li
                className="w-12 text-right text-red-400"
                onClick={() => {
                  Alert.confirm({
                    title: "게시글 삭제",
                    message: "게시글을 삭제하시겠습니까?",
                    confirmColor: "var(--color-red-400)",
                    onConfirm: handleDeletePost,
                  });
                }}
              >
                삭제
              </li>
            )}
          </ul>
        )}
      </div>
    </>
  );
}

export const PostMenu = memo(PostMenuImpl);
