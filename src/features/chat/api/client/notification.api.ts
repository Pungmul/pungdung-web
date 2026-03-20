import { clientApiRequest } from "@/core/api/client";

import {
  chatMutationVoidResponseSchema,
  chatNotificationEnabledDtoSchema,
  chatRoomNotificationMutedDtoSchema,
  chatRoomNotificationStateDtoSchema,
} from "./dto.schema";

export const updateGlobalChatNotification = (body: { enabled: boolean }) =>
  clientApiRequest({
    url: "/api/chats/notification",
    method: "PATCH",
    body: chatNotificationEnabledDtoSchema.parse(body),
    responseSchema: chatMutationVoidResponseSchema,
  });

export const updateChatRoomNotificationMuted = (
  roomId: string,
  body: { muted: boolean }
) =>
  clientApiRequest({
    url: `/api/chats/${roomId}/notification`,
    method: "PATCH",
    body: chatRoomNotificationMutedDtoSchema.parse(body),
    responseSchema: chatMutationVoidResponseSchema,
  });

export const loadChatRoomNotificationState = (roomId: string) =>
  clientApiRequest({
    url: `/api/chats/${roomId}/notification`,
    method: "GET",
    responseSchema: chatRoomNotificationStateDtoSchema,
  });
