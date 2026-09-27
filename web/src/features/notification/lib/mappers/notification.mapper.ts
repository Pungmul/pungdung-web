import type { UnreadNotificationItemDto } from "../../api/client/dto.schema";
import type { UnreadNotificationData } from "../../types";
import { resolveNotificationHref } from "../resolve-notification-href";

function firstFilled(
  ...values: Array<string | number | null | undefined>
): string | number | null {
  for (const value of values) {
    if (value == null) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    return value;
  }

  return null;
}

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
    // type, relatedId는 각자 항목 값 우선, 비어 있으면 data 값
    href: resolveNotificationHref({
      type: firstFilled(dto.type, dto.data?.type),
      relatedId: firstFilled(dto.relatedId, dto.data?.relatedId),
      chatRoomUUID: dto.data?.chatRoomUUID,
    }),
  };
}
