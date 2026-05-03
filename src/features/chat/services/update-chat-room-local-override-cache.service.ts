import {
  getChatRoomLocalOverridesCache,
  setChatRoomLocalOverridesCache,
} from "../lib";
import { CHAT_ROOM_LOCAL_OVERRIDES_CACHE_KEY } from "../types";

import { patchChatRoomLocalOverride } from "./chat-room-local-override.service";
import type { ChatRoomLocalOverridePatch } from "../types";

export async function updateChatRoomLocalOverrideCache(
  roomId: string,
  patch: ChatRoomLocalOverridePatch
) {
  const current = await getChatRoomLocalOverridesCache();
  const overrides = { ...(current?.overrides ?? {}) };
  const nextOverride = patchChatRoomLocalOverride(overrides[roomId], patch);

  if (!nextOverride) {
    delete overrides[roomId];
  } else {
    overrides[roomId] = nextOverride;
  }

  return setChatRoomLocalOverridesCache({
    key: CHAT_ROOM_LOCAL_OVERRIDES_CACHE_KEY,
    overrides,
    updatedAt: Date.now(),
  });
}
