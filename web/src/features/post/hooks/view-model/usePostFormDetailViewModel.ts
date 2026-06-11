"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { postQueries } from "../../queries";
import { getPostImageIdList } from "../../services";

/** 글쓰기/수정 에디터에서 게시글 상세 쿼리 기반 초기값·동기화에 쓰는 파생 상태 */
export function usePostFormDetailViewModel(postId: number | null) {
  const { data: postDetail } = useQuery(postQueries.detail(postId));

  const postTitle = postDetail?.title ?? "";
  const postContent = postDetail?.content ?? "";
  const postAuthor = postDetail?.author ?? "Anonymous";

  const postImageList = useMemo(
    () => postDetail?.imageList ?? [],
    [postDetail?.imageList]
  );

  const prevImageIdList = useMemo(
    () => getPostImageIdList(postImageList),
    [postImageList]
  );

  return {
    initContent: postContent,
    prevImageIdList,
    postTitle,
    postContent,
    postImageList,
    postAuthor,
  };
}
