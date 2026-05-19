import { resolveConfirmedLastReadMessageId } from "./resolve-confirmed-last-read-message-id.service";
import type { ReadAtResolutionMessage } from "./resolve-last-read-message-id-from-read-at.service";
import { resolveLastReadMessageIdFromReadAt } from "./resolve-last-read-message-id-from-read-at.service";

export function resolveLastReadMessageIdFromReadBroadcast(params: {
  messageIds: readonly number[];
  readAt?: string | null | undefined;
  timelineMessages?: readonly ReadAtResolutionMessage[] | undefined;
  /** 내 read 브로드캐스트 등, payload 보조 fallback */
  fallbackLastReadMessageId?: number | null | undefined;
}): number | null {
  const fromMessageIds = resolveConfirmedLastReadMessageId(params.messageIds);
  if (fromMessageIds !== null) {
    return fromMessageIds;
  }

  if (
    params.readAt !== undefined &&
    params.readAt !== null &&
    params.timelineMessages !== undefined &&
    params.timelineMessages.length > 0
  ) {
    const fromReadAt = resolveLastReadMessageIdFromReadAt(
      params.readAt,
      params.timelineMessages
    );
    if (fromReadAt !== null) {
      return fromReadAt;
    }
  }

  if (
    params.fallbackLastReadMessageId !== undefined &&
    params.fallbackLastReadMessageId !== null
  ) {
    return params.fallbackLastReadMessageId;
  }

  return null;
}
