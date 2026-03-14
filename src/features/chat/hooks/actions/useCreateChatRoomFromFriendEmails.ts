"use client";

import { useCallback } from "react";

import { useMutation } from "@tanstack/react-query";

import { Alert } from "@/shared";

import { chatMutationOptions } from "../../queries/chat.mutation";

export function useCreateChatRoomFromFriendEmails() {
  const { mutateAsync: createPersonal, isPending: isPersonalPending } =
    useMutation(chatMutationOptions.createPersonalChatRoom());
  const { mutateAsync: createMulti, isPending: isMultiPending } = useMutation(
    chatMutationOptions.createMultiChatRoom()
  );

  const isPending = isPersonalPending || isMultiPending;

  const createChatRoomFromFriendEmails = useCallback(
    async (friendEmails: string[]) => {
      try {
        const receiverNames = friendEmails
          .map((email) => email.trim())
          .filter((email) => email.length > 0);

        if (receiverNames.length === 0) {
          throw new Error("친구를 선택해주세요");
        }

        if (receiverNames.length === 1) {
          return (
            await createPersonal({
              receiverName: receiverNames[0]!,
            })
          ).roomUUID;
        }

        const response = await createMulti({
          receiverNameList: receiverNames,
        });

        return response.roomUUID;
      } catch (error) {
        Alert.alert({
          title: "채팅방 만들기",
          message:
            error instanceof Error
              ? error.message
              : "채팅방을 만들 수 없습니다.",
        });
        console.error("Error creating chat room:", error);
        return undefined;
      }
    },
    [createMulti, createPersonal]
  );

  return { createChatRoomFromFriendEmails, isPending };
}
