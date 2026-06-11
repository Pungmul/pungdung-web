"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { boardQueries } from "@/features/board";

import { Toast } from "@/shared/store";
import { alertStore } from "@/shared/store";

import { postMutationOptions, postQueries } from "../../queries";

export function useDeletePostAction() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const Alert = alertStore();

  return useMutation({
    ...postMutationOptions.delete(),
    onSuccess: async (_data, variables) => {
      await queryClient.resetQueries({
        queryKey: postQueries.lists(),
        type: "all",
      });
      await queryClient.resetQueries({
        queryKey: boardQueries.all(),
        type: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: postQueries.detailKey(variables.postId),
        refetchType: "all",
      });
      router.back();
      Toast.show({
        message: "게시글이 삭제되었습니다.",
      });
    },
    onError: (error: Error) => {
      Alert.alert({
        title: "오류",
        message: "삭제에 실패했습니다.",
        subMessage: error.message,
      });
    },
  });
}
