import type { Message } from "../domain/chat-message.types";

/**
 * 알 수 없는 값이 Message 타입인지 확인하는 타입 가드
 */
export const isMessage = (value: unknown): value is Message => {
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
};

/**
 * 알 수 없는 값이 TEXT 타입 Message인지 확인하는 타입 가드
 */
export const isTextMessage = (
  value: unknown
): value is Extract<Message, { chatType: "TEXT" }> => {
  return isMessage(value) && value.chatType === "TEXT";
};

/**
 * 알 수 없는 값이 IMAGE 타입 Message인지 확인하는 타입 가드
 */
export const isImageMessage = (
  value: unknown
): value is Extract<Message, { chatType: "IMAGE" }> => {
  return isMessage(value) && value.chatType === "IMAGE";
};

/**
 * 알 수 없는 값이 LEAVE 타입 Message인지 확인하는 타입 가드
 */
export const isLeaveMessage = (
  value: unknown
): value is Extract<Message, { chatType: "LEAVE" }> => {
  return isMessage(value) && value.chatType === "LEAVE";
};

/**
 * 알 수 없는 값이 JOIN 타입 Message인지 확인하는 타입 가드
 */
export const isJoinMessage = (
  value: unknown
): value is Extract<Message, { chatType: "JOIN" }> => {
  return isMessage(value) && value.chatType === "JOIN";
};
