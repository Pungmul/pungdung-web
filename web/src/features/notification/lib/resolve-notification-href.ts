export const NOTIFICATION_LINK_TYPE = {
  lightningMeeting: "LIGHTNING_MEETING",
  performance: "PERFORMANCE",
  post: "POST",
} as const;

export type NotificationLinkInput = {
  type?: string | null;
  relatedId?: string | null;
  chatRoomUUID?: string | null;
};

function readText(value: string | null | undefined): string | null {
  if (value == null) return null;
  const text = value.trim();
  return text.length > 0 ? text : null;
}

function readPositiveIntId(value: string | null): string | null {
  if (value == null || !/^[1-9]\d*$/.test(value)) return null;
  return value;
}

export function resolveNotificationHref(
  input: NotificationLinkInput
): string | null {
  const relatedId = readText(input.relatedId);
  const type = readText(input.type);
  if (relatedId == null || type == null) return null;

  if (type === NOTIFICATION_LINK_TYPE.post) {
    const postId = readPositiveIntId(relatedId);
    return postId == null ? null : `/board/d/${postId}`;
  }

  if (type === NOTIFICATION_LINK_TYPE.performance) {
    return `/board/promote/d/${encodeURIComponent(relatedId)}`;
  }

  if (type === NOTIFICATION_LINK_TYPE.lightningMeeting) {
    const chatRoomUUID = readText(input.chatRoomUUID);
    if (chatRoomUUID != null) {
      return `/chats/r/${encodeURIComponent(chatRoomUUID)}`;
    }

    return "/lightning";
  }

  return null;
}
