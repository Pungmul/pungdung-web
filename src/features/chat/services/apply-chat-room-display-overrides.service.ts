import type { ChatRoomInfo, ChatRoomListItem, ChatRoomLocalOverride } from "../types";

export function applyChatRoomDisplayOverrideToListItem(
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
    applyChatRoomDisplayOverrideToListItem(
      room,
      overrides[room.chatRoomUUID]
    )
  );
}

export function applyChatRoomDisplayOverrideToInfo(
  info: ChatRoomInfo,
  override: ChatRoomLocalOverride | undefined
): ChatRoomInfo {
  if (!override) return info;

  return {
    ...info,
    roomName: override.roomName ?? info.roomName,
    profileImageUrl:
      override.profileImageUrl !== undefined
        ? override.profileImageUrl
        : info.profileImageUrl,
  };
}
