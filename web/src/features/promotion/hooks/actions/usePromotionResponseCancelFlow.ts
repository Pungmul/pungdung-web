"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { getQueryClient } from "@/core";

import { Alert } from "@/shared";

import { promotionMutationOptions, promotionQueries } from "../../queries";

export function usePromotionResponseCancelFlow(responseId: string) {
  const router = useRouter();
  const queryClient = getQueryClient();
  const cancelOpts = promotionMutationOptions.cancelResponse();

  const { mutateAsync: cancelResponseAsync } = useMutation({
    mutationKey: cancelOpts.mutationKey,
    mutationFn: cancelOpts.mutationFn!,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: promotionQueries.upcomingList().queryKey,
      });
      router.replace(`/board/promote/upcoming`);
    },
    onError: (error: unknown) => {
      Alert.alert({
        title: "알림",
        message:
          error instanceof Error ? error.message : "요청에 실패했습니다.",
      });
    },
  });

  const handleCancelResponse = useCallback(() => {
    Alert.confirm({
      title: "신청 취소",
      message: "공연 관람 신청을 취소하시겠습니까?",
      confirmText: "취소하기",
      cancelText: "닫기",
      confirmColor: "red",
      onConfirm: () => {
        void (async () => {
          try {
            await cancelResponseAsync(responseId);
          } catch {
            // 실패 안내는 mutation onError
          }
        })();
      },
    });
  }, [cancelResponseAsync, responseId]);

  return { handleCancelResponse };
}
