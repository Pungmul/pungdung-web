import type {
  ChatRoomLocalOverride,
  ChatRoomLocalOverridePatch,
} from "../../types";

export function patchChatRoomLocalOverride(
  current: ChatRoomLocalOverride | undefined,
  patch: ChatRoomLocalOverridePatch
): ChatRoomLocalOverride | undefined {
  const next = { ...(current ?? {}) };

  if (Object.prototype.hasOwnProperty.call(patch, "roomName")) {
    if (patch.roomName === undefined) {
      delete next.roomName;
    } else {
      next.roomName = patch.roomName;
    }
  }

  if (Object.prototype.hasOwnProperty.call(patch, "profileImageUrl")) {
    if (patch.profileImageUrl === undefined) {
      delete next.profileImageUrl;
    } else {
      next.profileImageUrl = patch.profileImageUrl;
    }
  }

  if (next.roomName === undefined && next.profileImageUrl === undefined) {
    return undefined;
  }

  return next;
}
