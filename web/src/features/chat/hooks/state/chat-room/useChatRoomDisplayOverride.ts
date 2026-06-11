"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getChatRoomLocalOverridesCache,
  subscribeChatRoomLocalOverridesCacheUpdated,
} from "../../../lib";
import { updateChatRoomLocalOverrideCache } from "../../../services";
import type { ChatRoomLocalOverride } from "../../../types";

export function useChatRoomDisplayOverride(roomId: string) {
  const [override, setOverride] = useState<ChatRoomLocalOverride | undefined>();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    void getChatRoomLocalOverridesCache()
      .then((record) => {
        if (!active) return;
        setOverride(record?.overrides[roomId]);
      })
      .catch(() => {
        if (!active) return;
        setOverride(undefined);
      })
      .finally(() => {
        if (active) setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, [roomId]);

  useEffect(() => {
    return subscribeChatRoomLocalOverridesCacheUpdated((record) => {
      setOverride(record.overrides[roomId]);
    });
  }, [roomId]);

  const updateRoomName = useCallback(
    async (roomName: string | undefined) => {
      try {
        await updateChatRoomLocalOverrideCache(roomId, { roomName });
      } catch {
        // IndexedDB 저장 실패는 서버 query fallback 표시를 깨뜨리지 않는다.
      }
    },
    [roomId]
  );

  const updateProfileImageUrl = useCallback(
    async (profileImageUrl: string | null | undefined) => {
      try {
        await updateChatRoomLocalOverrideCache(roomId, { profileImageUrl });
      } catch {
        // IndexedDB 저장 실패는 서버 query fallback 표시를 깨뜨리지 않는다.
      }
    },
    [roomId]
  );

  return {
    override,
    hydrated,
    updateRoomName,
    updateProfileImageUrl,
  };
}
