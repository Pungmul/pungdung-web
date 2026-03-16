import dayjs from "dayjs";

import type { Message, PendingMessage } from "../types";

const SERVER_CLOCK_TOLERANCE_MS = 2_000;

const toTimestamp = (value: string): number | null => {
  const timestamp = dayjs(value).valueOf();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const isConfirmedAfterPending = (
  confirmed: Message,
  pending: PendingMessage
): boolean => {
  const confirmedAt = toTimestamp(confirmed.createdAt);
  const pendingAt = toTimestamp(pending.createdAt);

  if (confirmedAt === null || pendingAt === null) return true;
  return confirmedAt + SERVER_CLOCK_TOLERANCE_MS >= pendingAt;
};

const isSamePendingEcho = (
  confirmed: Message,
  pending: PendingMessage
): boolean => {
  if (pending.state !== "pending") return false;
  if (confirmed.senderUsername !== pending.senderUsername) return false;
  if (confirmed.chatRoomUUID !== pending.chatRoomUUID) return false;
  if (confirmed.chatType !== pending.chatType) return false;
  if (!isConfirmedAfterPending(confirmed, pending)) return false;

  if (confirmed.chatType === "TEXT" && pending.chatType === "TEXT") {
    return confirmed.content === pending.content;
  }

  return confirmed.chatType === "IMAGE" && pending.chatType === "IMAGE";
};

export function removePendingMessagesShadowedByConfirmed(
  pendingMessages: readonly PendingMessage[],
  confirmedMessages: readonly Message[]
): PendingMessage[] {
  const confirmedClientIds = new Set(
    confirmedMessages
      .map((message) => message.clientId)
      .filter((clientId): clientId is string => Boolean(clientId))
  );
  const matchedConfirmedIndexes = new Set<number>();

  return pendingMessages.filter((pending) => {
    if (pending.state !== "pending") return true;
    if (pending.clientId) {
      return !confirmedClientIds.has(pending.clientId);
    }

    const matchedIndex = confirmedMessages.findIndex((confirmed, index) => {
      if (matchedConfirmedIndexes.has(index)) return false;
      return isSamePendingEcho(confirmed, pending);
    });

    if (matchedIndex === -1) return true;
    matchedConfirmedIndexes.add(matchedIndex);
    return false;
  });
}
