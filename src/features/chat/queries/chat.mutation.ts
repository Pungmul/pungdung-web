import { mutationOptions } from "@tanstack/react-query";

import {
  createMultiChatRoom,
  createPersonalChatRoom,
  exitChat,
  inviteUser,
  sendImageMessage,
  sendTextMessage,
  updateChatRoomNotificationMuted,
  updateGlobalChatNotification,
} from "../api";

import { chatQueryInternal } from "./chat-query-internal";

const root = chatQueryInternal.all();

/** useMutation에 넘길 옵션. useMutation(chatMutationOptions.inviteUser()) */
export const chatMutationOptions = {
  createPersonalChatRoom: () =>
    mutationOptions({
      mutationKey: [...root, "createPersonalChatRoom"],
      mutationFn: (body: { receiverName: string }) =>
        createPersonalChatRoom(body),
    }),

  createMultiChatRoom: () =>
    mutationOptions({
      mutationKey: [...root, "createMultiChatRoom"],
      mutationFn: (body: { receiverNameList: string[] }) =>
        createMultiChatRoom(body),
    }),

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

  sendTextMessage: () =>
    mutationOptions({
      mutationKey: [...root, "sendTextMessage"],
      mutationFn: ({
        roomId,
        message,
      }: {
        roomId: string;
        message: { content: string; clientId: string };
      }) => sendTextMessage(roomId, message),
    }),

  sendImageMessage: () =>
    mutationOptions({
      mutationKey: [...root, "sendImageMessage"],
      mutationFn: ({
        roomId,
        formData,
      }: {
        roomId: string;
        formData: FormData;
      }) => sendImageMessage(roomId, formData),
    }),

  updateGlobalNotification: () =>
    mutationOptions({
      mutationKey: [...root, "updateGlobalNotification"],
      mutationFn: (body: { enabled: boolean }) =>
        updateGlobalChatNotification(body),
    }),

  updateRoomNotification: () =>
    mutationOptions({
      mutationKey: [...root, "updateRoomNotification"],
      mutationFn: ({
        roomId,
        body,
      }: {
        roomId: string;
        body: { muted: boolean };
      }) => updateChatRoomNotificationMuted(roomId, body),
    }),
};
