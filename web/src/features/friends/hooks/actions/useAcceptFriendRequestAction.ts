"use client";

import { useCallback } from "react";

import { useMutation,useQueryClient } from "@tanstack/react-query";

import { Toast } from "@/shared";

import { friendMutationOptions, friendQueries } from "../../queries";

/**
 * 수신 친구 요청 수락 UI → mutation.
 * 성공 시 쿼리 무효화는 `useAcceptFriendRequestMutation`의 `onSuccess`에서 처리한다.
 */
export function useAcceptFriendRequestAction() {
  const queryClient = useQueryClient();
  const { mutateAsync: baseMutateAsync, ...rest } = useMutation({
    ...friendMutationOptions.accept(),
  });

  const handleReceiveFriend = useCallback(
    async (requestId: number) => {
      try {
        await baseMutateAsync(requestId);
        await queryClient.invalidateQueries(friendQueries.all());
        Toast.show({ message: "친구 수락 완료", type: "success" });
      } catch {
        Toast.show({ message: "친구 수락 실패", type: "error" });
      }
    },
    [baseMutateAsync, queryClient]
  );

  return { handleReceiveFriend, ...rest };
}
