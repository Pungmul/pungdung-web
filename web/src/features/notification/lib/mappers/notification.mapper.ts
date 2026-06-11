import type { UnreadNotificationItemDto } from "../../api/client/dto.schema";
import type { UnreadNotificationData } from "../../types";

const INVALID_RECEIVED_AT_FALLBACK = new Date(0);

function resolveReceivedAt(
  sentAt: string | undefined,
  dataSentAt: string | undefined
): Date {
  const source = sentAt ?? dataSentAt;

  if (typeof source === "string") {
    const parsedReceivedAt = new Date(source);
    if (!Number.isNaN(parsedReceivedAt.getTime())) {
      return parsedReceivedAt;
    }
  }

  return INVALID_RECEIVED_AT_FALLBACK;
}

export function toNotificationData(
  dto: UnreadNotificationItemDto
): UnreadNotificationData {
  return {
    logId: dto.id,
    title: dto.title,
    body: dto.body ?? "",
    receivedAt: resolveReceivedAt(dto.sentAt, dto.data?.sentAt),
  };
}
