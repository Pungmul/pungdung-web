export type ReadSignPublishPayload = {
  chatRoomUUID: string;
  lastReadMessageId?: number;
};

export function buildReadSignPublishPayload(
  roomId: string,
  targetMessageId: number | null
): ReadSignPublishPayload {
  if (targetMessageId === null) {
    return { chatRoomUUID: roomId };
  }

  return {
    chatRoomUUID: roomId,
    lastReadMessageId: targetMessageId,
  };
}
