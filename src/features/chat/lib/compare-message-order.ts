import dayjs from "dayjs";

import { toNumericMessageId } from "./parse-message-id";

type MessageOrderTarget = {
  id: number | string;
  createdAt: string;
};

function toTimestamp(createdAt: string): number | null {
  const timestamp = dayjs(createdAt).valueOf();
  return Number.isNaN(timestamp) ? null : timestamp;
}

/**
 * 오름차순(오래된 -> 최신) 기준 comparator.
 * - 숫자 message id가 둘 다 유효하면 id 우선
 * - 한쪽만 숫자 id인 경우 id 비교를 건너뛰고 createdAt으로 비교
 * - createdAt 비교 불가 시 String(id) fallback
 */
export function compareMessagesBySequence(
  a: MessageOrderTarget,
  b: MessageOrderTarget
): number {
  const aNumericId = toNumericMessageId(a.id);
  const bNumericId = toNumericMessageId(b.id);

  if (aNumericId !== null && bNumericId !== null && aNumericId !== bNumericId) {
    return aNumericId - bNumericId;
  }

  const aTimestamp = toTimestamp(a.createdAt);
  const bTimestamp = toTimestamp(b.createdAt);

  if (aTimestamp !== null && bTimestamp !== null && aTimestamp !== bTimestamp) {
    return aTimestamp - bTimestamp;
  }

  return String(a.id).localeCompare(String(b.id));
}

export function sortMessagesOldestFirst<T extends MessageOrderTarget>(
  messages: readonly T[]
): T[] {
  return [...messages].sort(compareMessagesBySequence);
}

export function sortMessagesNewestFirst<T extends MessageOrderTarget>(
  messages: readonly T[]
): T[] {
  return [...messages].sort((a, b) => compareMessagesBySequence(b, a));
}
