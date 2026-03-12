"use client";

import { useCallback } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Toast } from "@/shared";

import { friendMutationOptions, friendQueries } from "../../queries";

/** 거절·보낸 요청 취소 성공 시 `friends` 루트 쿼리 전부 무효화. */
export function useRejectFriendRequestAction() {
  const queryClient = useQueryClient();

  const { mutateAsync: baseMutateAsync, ...rest } = useMutation({
    ...friendMutationOptions.reject(),
  });

  const handleRejectFriend = useCallback(
    async (requestId: number) => {
      try {
        await baseMutateAsync(requestId);
        await queryClient.invalidateQueries(friendQueries.all());
        Toast.show({ message: "친구 거절 완료", type: "success" });
      } catch {
        Toast.show({ message: "친구 거절 실패", type: "error" });
      }
    },
    [baseMutateAsync, queryClient]
  );
  return { ...rest, handleRejectFriend };
}
