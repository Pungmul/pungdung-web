import dayjs from "dayjs";

import type { Message } from "../types";

export function normalizeSocketImageMessage(message: Message): Message {
  return {
    id: message.id,
    clientId: message.clientId ?? null,
    senderUsername: message.senderUsername,
    content: null,
    chatType: "IMAGE",
    imageUrlList: message.imageUrlList || [],
    chatRoomUUID: message.chatRoomUUID,
    createdAt: message.createdAt || dayjs().format("YYYY-MM-DD HH:mm:ss"),
  };
}
