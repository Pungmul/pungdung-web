import type { QueryClient } from "@tanstack/react-query";
import { mutationOptions } from "@tanstack/react-query";

import {
  exitChat,
  inviteUser,
  sendImageMessage,
  sendTextMessage,
} from "../api";

import { chatQueryInternal } from "./chat-query-internal";

const root = chatQueryInternal.all();

/** useMutation에 넘길 옵션. useMutation(chatMutationOptions.inviteUser()) */
export const chatMutationOptions = {
  exitChat: () =>
    mutationOptions({
      mutationKey: [...root, "exitChat"],
      mutationFn: (roomId: string) => exitChat(roomId),
    }),

  inviteUser: () =>
    mutationOptions({
      mutationKey: [...root, "inviteUser"],
      mutationFn: ({
        roomId,
        data,
      }: {
        roomId: string;
        data: { newUsernameList: string[] };
      }) => inviteUser(roomId, data),
    }),

  sendTextMessage: (queryClient: QueryClient) =>
    mutationOptions({
      mutationKey: [...root, "sendTextMessage"],
      mutationFn: ({
        roomId,
        message,
      }: {
        roomId: string;
        message: { content: string };
      }) => sendTextMessage(roomId, message),
      onSuccess: (_data, { roomId }) => {
        void queryClient.invalidateQueries({
          queryKey: chatQueryInternal.room(roomId),
        });
      },
      onError: (error) => {
        console.error("텍스트 메시지 전송 실패:", error);
      },
    }),

  sendImageMessage: (queryClient: QueryClient) =>
    mutationOptions({
      mutationKey: [...root, "sendImageMessage"],
      mutationFn: ({
        roomId,
        formData,
      }: {
        roomId: string;
        formData: FormData;
      }) => sendImageMessage(roomId, formData),
      onSuccess: (_data, { roomId }) => {
        void queryClient.invalidateQueries({
          queryKey: chatQueryInternal.room(roomId),
        });
      },
      onError: (error) => {
        console.error("이미지 메시지 전송 실패:", error);
      },
    }),
};
