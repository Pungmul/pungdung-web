"use client";

import { useEffect, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { useChatRoomLocalOverrides } from "./useChatRoomLocalOverrides";
import {
  getChatRoomListCache,
  setChatRoomListCache,
  subscribeChatRoomListCacheUpdated,
} from "../../lib";
import { chatQueries } from "../../queries";
import { applyChatRoomDisplayOverridesToList } from "../../services";
import { mergeChatRoomListWithCache } from "../../services/merge-chat-room-list-with-cache.service";
import type { ChatRoomListItem } from "../../types";
import { CHAT_ROOM_LIST_CACHE_KEY } from "../../types";

export function useChatRoomListIndexedDB() {
  const [cachedRooms, setCachedRooms] = useState<ChatRoomListItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const localOverrides = useChatRoomLocalOverrides();

  useEffect(() => {
    let active = true;

    void getChatRoomListCache()
      .then((record) => {
        if (!active) return;
        if (record?.rooms?.length) {
          setCachedRooms(record.rooms);
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
    return subscribeChatRoomListCacheUpdated((record) => {
      setCachedRooms(record.rooms);
    });
  }, []);

  const roomListQuery = useQuery({
    ...chatQueries.roomList(),
    enabled: hydrated,
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
    const mergedRooms = mergeChatRoomListWithCache(cachedRooms, queried);
    return applyChatRoomDisplayOverridesToList(mergedRooms, localOverrides);
  }, [cachedRooms, localOverrides, roomListQuery.data]);

  return {
    rooms,
    hydrated,
    isLoading: !hydrated || (roomListQuery.isLoading && rooms.length === 0),
    isFetching: roomListQuery.isFetching,
  };
}
