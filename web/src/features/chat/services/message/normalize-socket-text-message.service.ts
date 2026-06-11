import dayjs from "dayjs";

import type { Message } from "../../types";

export function normalizeSocketTextMessage(message: Message): Message {
  return {
    id: message.id,
    clientId: message.clientId ?? null,
    senderUsername: message.senderUsername,
    content: message.content || "",
    chatType: "TEXT",
    imageUrlList: null,
    chatRoomUUID: message.chatRoomUUID,
    createdAt: message.createdAt || dayjs().format("YYYY-MM-DD HH:mm:ss"),
  };
}
