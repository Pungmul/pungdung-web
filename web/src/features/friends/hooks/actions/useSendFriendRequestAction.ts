"use client";

import { useCallback } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { User } from "@/features/user";

import { Toast } from "@/shared";

import { friendMutationOptions, friendQueries } from "../../queries";

/** 친구 찾기 유저 행 → 친구 요청(성공 시 검색 기록 반영은 mutation 내부). */
export function useSendFriendRequestAction() {
  const queryClient = useQueryClient();
  const { mutateAsync: baseMutateAsync, ...rest } = useMutation(
    friendMutationOptions.request()
  );

  const handleRequestFriend = useCallback(
    async (user: User) => {
      try {
        await baseMutateAsync(user.username);
        await queryClient.invalidateQueries(friendQueries.all());
        Toast.show({ message: "친구 요청 완료", type: "success" });
      } catch {
        Toast.show({ message: "친구 요청 실패", type: "error" });
      }
    },
    [baseMutateAsync, queryClient]
  );

  return { handleRequestFriend, ...rest };
}
