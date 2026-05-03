import type { ChatRoomListItem, ChatRoomLocalOverride } from "../types";

function applyChatRoomDisplayOverrideToListItem(
  room: ChatRoomListItem,
  override: ChatRoomLocalOverride | undefined
): ChatRoomListItem {
  if (!override) return room;

  return {
    ...room,
    roomName: override.roomName ?? room.roomName,
    profileImageUrl:
      override.profileImageUrl !== undefined
        ? override.profileImageUrl
        : room.profileImageUrl,
  };
}

export function applyChatRoomDisplayOverridesToList(
  rooms: ChatRoomListItem[],
  overrides: Record<string, ChatRoomLocalOverride>
): ChatRoomListItem[] {
  return rooms.map((room) =>
    applyChatRoomDisplayOverrideToListItem(room, overrides[room.chatRoomUUID])
  );
}
