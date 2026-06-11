import dayjs from "dayjs";

import { toNumericMessageId } from "../../lib/message/parse-message-id";

export type ReadAtResolutionMessage = {
  id: number | string;
  createdAt: string;
};

/** Java `Instant` 나노초(9자리)·타임존 생략 등 dayjs 파싱 보정 */
function parseReadReceiptTimestamp(value: string): number | null {
  let normalized = value.trim();
  const fractionMatch = normalized.match(/^(.+?)\.(\d+)(.*)$/);
  if (fractionMatch) {
    const head = fractionMatch[1] ?? "";
    const fraction = fractionMatch[2] ?? "";
    const tail = fractionMatch[3] ?? "";
    normalized = `${head}.${fraction.slice(0, 3)}${tail}`;
  }

  if (!/[zZ]|[+-]\d{2}:\d{2}$/.test(normalized)) {
    normalized = `${normalized}Z`;
  }

  const parsed = dayjs(normalized).valueOf();
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * readAt 시각 기준으로 읽은 마지막 채팅 메시지 id를 찾는다.
 * createdAt <= readAt 인 메시지 중 numeric id 최댓값.
 */
export function resolveLastReadMessageIdFromReadAt(
  readAt: string,
  messages: readonly ReadAtResolutionMessage[]
): number | null {
  const readAtMs = parseReadReceiptTimestamp(readAt);
  if (readAtMs === null || messages.length === 0) {
    return null;
  }

  let latestMessageId: number | null = null;

  for (const message of messages) {
    const numericId = toNumericMessageId(message.id);
    if (numericId === null) {
      continue;
    }

    const messageMs = parseReadReceiptTimestamp(message.createdAt);
    if (messageMs === null || messageMs > readAtMs) {
      continue;
    }

    latestMessageId =
      latestMessageId === null
        ? numericId
        : Math.max(latestMessageId, numericId);
  }

  return latestMessageId;
}
