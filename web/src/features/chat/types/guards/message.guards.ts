import type { Message } from "../chat-message.types";

export function isMessage(value: unknown): value is Message {
  if (typeof value !== "object" || value === null) return false;

  const msg = value as Record<string, unknown>;

  return (
    (typeof msg.id === "number" || typeof msg.id === "string") &&
    typeof msg.senderUsername === "string" &&
    typeof msg.chatRoomUUID === "string" &&
    typeof msg.createdAt === "string" &&
    (msg.chatType === "TEXT" ||
      msg.chatType === "IMAGE" ||
      msg.chatType === "LEAVE" ||
      msg.chatType === "JOIN")
  );
}

export function isTextMessage(
  value: unknown
): value is Extract<Message, { chatType: "TEXT" }> {
  return isMessage(value) && value.chatType === "TEXT";
}

export function isImageMessage(
  value: unknown
): value is Extract<Message, { chatType: "IMAGE" }> {
  return isMessage(value) && value.chatType === "IMAGE";
}
