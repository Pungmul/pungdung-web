import type { OtherParticipantReadSnapshot } from "./merge-other-participant-read-from-socket.service";
import type { UserLastReadMessageId } from "../types/chat-room.types";

export function snapshotToUserInitReadList(
  snapshot: OtherParticipantReadSnapshot
): UserLastReadMessageId[] {
  return Object.entries(snapshot).map(([userId, lastReadMessageId]) => ({
    userId: Number(userId),
    lastReadMessageId,
  }));
}
