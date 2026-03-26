"use client";

import { useEffect, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { DEFAULT_STALE_TIME_MS } from "../../constants";
import {
  getChatRoomLocalOverridesCache,
  getChatRoomListCache,
  setChatRoomListCache,
  subscribeChatRoomLocalOverridesCacheUpdated,
  subscribeChatRoomListCacheUpdated,
} from "../../lib";
import { applyChatRoomDisplayOverridesToList } from "../../services";
import { chatQueries } from "../../queries";
import { mergeChatRoomListWithCache } from "../../services/merge-chat-room-list-with-cache.service";
import type { ChatRoomListItem, ChatRoomLocalOverride } from "../../types";
import { CHAT_ROOM_LIST_CACHE_KEY } from "../../types";

export function useChatRoomListIndexedDB() {
  const [cachedRooms, setCachedRooms] = useState<ChatRoomListItem[]>([]);
  const [cacheUpdatedAt, setCacheUpdatedAt] = useState<number | null>(null);
  const [localOverrides, setLocalOverrides] = useState<
    Record<string, ChatRoomLocalOverride>
  >({});
  const [hydrated, setHydrated] = useState(false);
  const [allowQuery, setAllowQuery] = useState(false);

  useEffect(() => {
    let active = true;

    void getChatRoomListCache()
      .then((record) => {
        if (!active) return;
        // 목록은 캐시가 있으면 즉시 화면에 노출해 첫 진입 체감을 줄인다.
        if (record?.rooms?.length) {
          setCachedRooms(record.rooms);
          setCacheUpdatedAt(record.updatedAt);
        }
      })
      .finally(() => {
        if (active) setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, []);

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

  useEffect(() => {
    return subscribeChatRoomListCacheUpdated((record) => {
      setCachedRooms(record.rooms);
      setCacheUpdatedAt(record.updatedAt);
    });
  }, []);

  const isCacheFresh = useMemo(() => {
    if (!cacheUpdatedAt) return false;
    return Date.now() - cacheUpdatedAt < DEFAULT_STALE_TIME_MS;
  }, [cacheUpdatedAt]);

  useEffect(() => {
    if (!hydrated) return;

    if (!cachedRooms.length) {
      setAllowQuery(true);
      return;
    }

    if (!isCacheFresh) {
      setAllowQuery(true);
      return;
    }

    const ttlLeft =
      DEFAULT_STALE_TIME_MS - (Date.now() - (cacheUpdatedAt ?? 0));
    const timer = window.setTimeout(() => {
      setAllowQuery(true);
    }, Math.max(ttlLeft, 1000));

    return () => window.clearTimeout(timer);
  }, [hydrated, cachedRooms.length, isCacheFresh, cacheUpdatedAt]);

  const roomListQuery = useQuery({
    ...chatQueries.roomList(),
    enabled: hydrated && allowQuery,
  });

  useEffect(() => {
    if (!roomListQuery.data) return;

    void setChatRoomListCache(
      {
        key: CHAT_ROOM_LIST_CACHE_KEY,
        rooms: roomListQuery.data,
        updatedAt: Date.now(),
        validatedAt: Date.now(),
      },
      { emitUpdatedEvent: false }
    );
  }, [roomListQuery.data]);

  const rooms = useMemo(() => {
    const queried = roomListQuery.data ?? [];
    // 캐시 우선 렌더 후 서버 응답으로 방 단위 병합(최신 데이터 우선).
    const mergedRooms = mergeChatRoomListWithCache(cachedRooms, queried);
    return applyChatRoomDisplayOverridesToList(mergedRooms, localOverrides);
  }, [cachedRooms, localOverrides, roomListQuery.data]);

  return {
    rooms,
    hydrated,
    isLoading:
      !hydrated ||
      (allowQuery && roomListQuery.isLoading && rooms.length === 0),
    isFetching: roomListQuery.isFetching,
  };
}
