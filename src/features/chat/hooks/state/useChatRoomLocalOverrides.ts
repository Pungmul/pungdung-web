"use client";

import { useEffect, useState } from "react";

import {
  getChatRoomLocalOverridesCache,
  subscribeChatRoomLocalOverridesCacheUpdated,
} from "../../lib";
import type { ChatRoomLocalOverride } from "../../types";

/**
 * IndexedDB의 로컬 오버라이드(채팅방 이름·프로필 이미지 덮어쓰기)를 hydrate하고
 * CustomEvent 구독을 통해 변경을 실시간으로 반영합니다.
 */
export function useChatRoomLocalOverrides(): Record<
  string,
  ChatRoomLocalOverride
> {
  const [localOverrides, setLocalOverrides] = useState<
    Record<string, ChatRoomLocalOverride>
  >({});

  useEffect(() => {
    let active = true;
    void getChatRoomLocalOverridesCache()
      .then((record) => {
        if (!active) return;
        setLocalOverrides(record?.overrides ?? {});
      })
      .catch(() => {
        if (!active) return;
        setLocalOverrides({});
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return subscribeChatRoomLocalOverridesCacheUpdated((record) => {
      setLocalOverrides(record.overrides);
    });
  }, []);

  return localOverrides;
}
