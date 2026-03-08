import type {
  ChatRoomUpdateMessage,
  Message,
  ReadSocketMessage,
} from "./index";

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

export const isChatRoomUpdateMessage = (
  value: unknown
): value is ChatRoomUpdateMessage => {
  if (typeof value !== "object" || value === null) return false;
  const m = value as Record<string, unknown>;
  if (typeof m.chatRoomUUID !== "string") return false;

  if (m.type === "READ") return true;

  const hasTimestamp = typeof m.timestamp === "string";
  const rawContent = m.content;
  const contentOk =
    rawContent === null || typeof rawContent === "string";

  return hasTimestamp && contentOk;
};

export const isReadSocketMessage = (
  value: unknown
): value is ReadSocketMessage => {
  if (typeof value !== "object" || value === null) return false;
  const m = value as Record<string, unknown>;
  if (typeof m.messageLogId !== "number") return false;
  if (typeof m.domainType !== "string") return false;
  if (typeof m.businessIdentifier !== "string") return false;
  if (typeof m.identifier !== "string") return false;
  if (typeof m.stompDest !== "string") return false;

  const c = m.content;
  if (typeof c !== "object" || c === null) return false;
  const content = c as Record<string, unknown>;
  if (typeof content.userId !== "number") return false;
  if (!Array.isArray(content.messageIds)) return false;
  if (!content.messageIds.every((id) => typeof id === "number")) return false;

  return typeof content.readAt === "string";
};
