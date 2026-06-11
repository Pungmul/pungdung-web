import { patchUnreadCountResetInRoomList } from "./patch-unread-count-reset-in-room-list.service";
import type { ChatRoomListItem } from "../../types/chat-room.types";

export type RoomListUnreadResetCachePlan =
  | { kind: "skip" }
  | { kind: "invalidate" }
  | { kind: "patch"; next: ChatRoomListItem[]; changed: boolean };

export function resolveRoomListUnreadResetCachePlan(
  prev: ChatRoomListItem[] | undefined,
  roomId: string
): RoomListUnreadResetCachePlan {
  if (!prev?.length) {
    return { kind: "skip" };
  }

  const roomExists = prev.some((room) => room.chatRoomUUID === roomId);
  if (!roomExists) {
    return { kind: "invalidate" };
  }

  const { next, changed } = patchUnreadCountResetInRoomList(prev, roomId);
  return { kind: "patch", next, changed };
}
