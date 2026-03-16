import dayjs from "dayjs";

import type { Message, PendingMessage } from "../types";

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

/**
 * 소켓으로 내가 보낸 텍스트 메시지가 확인되면, 동일 content의 pending 한 건을 제거합니다.
 * (전송 API onSuccess 제거와 중복될 수 있어 이중 제거는 무해합니다.)
 */
export function removePendingMatchedBySocketTextEcho(
  pending: PendingMessage[],
  socketMessage: Message,
  myUsername: string
): PendingMessage[] {
  if (socketMessage.senderUsername !== myUsername) return pending;
  if (socketMessage.clientId) {
    const byClientId = pending.findIndex(
      (msg) => msg.state === "pending" && msg.clientId === socketMessage.clientId
    );
    if (byClientId === -1) return pending;
    return [...pending.slice(0, byClientId), ...pending.slice(byClientId + 1)];
  }
  if (socketMessage.chatType !== "TEXT") return pending;

  const text = socketMessage.content;
  const idx = pending.findIndex(
    (msg) =>
      msg.state === "pending" &&
      msg.senderUsername === myUsername &&
      msg.chatRoomUUID === socketMessage.chatRoomUUID &&
      msg.chatType === "TEXT" &&
      msg.content === text
  );
  if (idx === -1) return pending;
  return [...pending.slice(0, idx), ...pending.slice(idx + 1)];
}
