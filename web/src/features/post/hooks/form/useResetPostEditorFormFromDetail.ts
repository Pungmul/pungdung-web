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
  const { reset, getValues } = form;
  const { postTitle, postContent, postImageList } = snapshot;

  useEffect(() => {
    reset({
      ...buildPostEditorDefaultValues({
        postTitle,
        postContent,
        postImageList,
      }),
      // 상세 refetch로 리셋될 때 사용자가 토글한 익명 체크를 덮지 않는다.
      anonymity: getValues("anonymity"),
    });
  }, [getValues, postContent, postImageList, postTitle, reset]);
}
