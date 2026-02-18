"use client";

import { useCallback } from "react";

import { alertStore, Toast } from "@/shared";

import { useLikePostAction } from "./useLikePostAction";
import type { PostLikeSnapshot } from "../../types/post-like.types";

export function usePostLikeWithConfirmAction() {
  const Alert = alertStore();
  const { mutate: likePost } = useLikePostAction();

  const requestToggle = useCallback(
    (params: {
      postId: number;
      isLikedBeforeToggle: boolean;
      onApplied: (data: PostLikeSnapshot) => void;
    }) => {
      const { postId, isLikedBeforeToggle, onApplied } = params;
      Alert.confirm({
        title: "추천",
        message: isLikedBeforeToggle
          ? "추천을 취소하시겠습니까?"
          : "이 게시글을 추천하시겠습니까?",
        onConfirm: () => {
          likePost(postId, {
            onSuccess: (data) => {
              onApplied(data);
              Toast.show({
                message: data.liked
                  ? "게시글을 추천했습니다."
                  : "추천이 취소 되었습니다.",
                type: "success",
              });
            },
            onError: (error: Error) => {
              Alert.alert({
                title: "오류",
                message: error.message,
              });
            },
          });
        },
      });
    },
    [Alert, likePost]
  );

  return { requestToggle };
}
