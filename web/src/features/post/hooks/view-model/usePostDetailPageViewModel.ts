"use client";

import { useEffect, useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { boardQueries } from "@/features/board";

import { isPostDeletedError } from "../../api/client";
import { postQueries } from "../../queries";

/** 모바일/공통 게시글 상세 페이지: 상세·보드명·문서 제목 파생 */
export function usePostDetailPageViewModel(postId: number) {
  const { data: post, isLoading, error } = useQuery(postQueries.detail(postId));
  const isDeletedPostError = isPostDeletedError(error);

  const { data: boardList } = useQuery(boardQueries.list());

  const boardName = useMemo(
    () => boardList?.find((board) => board.id === post?.categoryId)?.name ?? "",
    [boardList, post?.categoryId]
  );

  useEffect(() => {
    if (isDeletedPostError) {
      document.title = "풍덩 | 삭제된 게시글";
      return;
    }
    if (!post) return;
    document.title = `풍덩 | ${post.title}`;
  }, [post, isDeletedPostError]);

  const isWriter = post?.isWriter ?? false;

  return { post, isLoading, boardName, isWriter, isDeletedPostError };
}
