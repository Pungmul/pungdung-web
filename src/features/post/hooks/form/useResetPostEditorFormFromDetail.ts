"use client";

import { useEffect } from "react";

import type { UseFormReturn } from "react-hook-form";

import { buildPostEditorDefaultValues } from "../../services";
import type { PostEditorFormDetailSnapshot } from "../../types";
import type { PostEditorFormValues } from "../../types/schemas";

export type ResetPostEditorFormFromDetailInput = PostEditorFormDetailSnapshot;

/** 상세(또는 빈 초기값)를 편집 폼(react-hook-form) 기본값에 반영한다. */
export function useResetPostEditorFormFromDetail(
  form: UseFormReturn<PostEditorFormValues>,
  snapshot: ResetPostEditorFormFromDetailInput
) {
  const { reset } = form;
  const { postTitle, postContent, postImageList, postAuthor } = snapshot;

  useEffect(() => {
    reset(
      buildPostEditorDefaultValues({
        postTitle,
        postContent,
        postImageList,
        postAuthor,
      })
    );
  }, [postAuthor, postContent, postImageList, postTitle, reset]);
}
