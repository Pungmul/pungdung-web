"use client";

import { useEffect, useMemo, useState } from "react";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { CHAT_LOG_PAGE_SIZE, DEFAULT_STALE_TIME_MS } from "../../constants";
import { getChatRoomMessagesCache, setChatRoomMessagesCache } from "../../lib";
import { chatQueries } from "../../queries";
import type { Message } from "../../types";
import { CHAT_ROOM_MESSAGES_CACHE_KEY_PREFIX } from "../../types";

const INITIAL_RENDER_WINDOW_SIZE = CHAT_LOG_PAGE_SIZE * 2;

// 동일 ID/생성시각 기준으로 이전 상태와 같은지 비교해
// 캐시 동기화 effect의 불필요한 state 루프를 막는다.
function isSameMessageArray(a: Message[], b: Message[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    const left = a[i];
    const right = b[i];
    if (!left || !right) return false;
    if (String(left.id) !== String(right.id)) return false;
    if (left.createdAt !== right.createdAt) return false;
  }
  return true;
}

export function useChatRoomMessagesIndexedDB(roomId: string) {
  const [cachedMessages, setCachedMessages] = useState<Message[]>([]);
  const [cachedAllMessages, setCachedAllMessages] = useState<Message[]>([]);
  const [cachedOldestCursor, setCachedOldestCursor] = useState<number | null>(
    null
  );
  const [cacheUpdatedAt, setCacheUpdatedAt] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [allowQuery, setAllowQuery] = useState(false);

  useEffect(() => {
    let active = true;

    void getChatRoomMessagesCache(roomId)
      .then((record) => {
        if (!active || !record) return;
        // 초기 렌더는 DB 최신 구간만 사용하고,
        // 전체 캐시는 이후 병합 저장 시 재사용한다.
        const safeMessages = Array.isArray(record.messages)
          ? record.messages
          : [];
        setCachedAllMessages(safeMessages);
        const recent = safeMessages.slice(-INITIAL_RENDER_WINDOW_SIZE);
        setCachedMessages(recent);
        setCacheUpdatedAt(record.updatedAt);
        setCachedOldestCursor(record.oldestCursor ?? null);
      })
      .finally(() => {
        if (active) setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, [roomId]);

  const isCacheFreshAndSufficient = useMemo(() => {
    if (!cacheUpdatedAt) return false;
    const isFresh = Date.now() - cacheUpdatedAt < DEFAULT_STALE_TIME_MS;
    return isFresh && cachedMessages.length >= CHAT_LOG_PAGE_SIZE;
  }, [cacheUpdatedAt, cachedMessages.length]);

  useEffect(() => {
    if (!hydrated) return;

    if (!isCacheFreshAndSufficient) {
      setAllowQuery(true);
      return;
    }

    const ttlLeft =
      DEFAULT_STALE_TIME_MS - (Date.now() - (cacheUpdatedAt ?? 0));
    const timer = window.setTimeout(() => {
      setAllowQuery(true);
    }, Math.max(ttlLeft, 1000));

    return () => window.clearTimeout(timer);
  }, [hydrated, isCacheFreshAndSufficient, cacheUpdatedAt]);

  const roomQuery = useQuery({
    ...chatQueries.room(roomId),
    enabled: hydrated && allowQuery,
  });

  const roomInfiniteQuery = useInfiniteQuery({
    ...chatQueries.roomInfinite(roomId),
    // hasNextPage/nextCursor 메타를 유지하려면 infinite 쿼리는
    // 캐시 freshness와 무관하게 hydration 이후 즉시 활성화해야 한다.
    enabled: hydrated,
  });

  useEffect(() => {
    const fromInfinite =
      roomInfiniteQuery.data?.pages?.flatMap((page) => page.messages) ?? [];
    const fromRoom = roomQuery.data?.messageList?.list ?? [];
    // 서버 최신(20개)으로 캐시 전체를 덮어쓰지 않도록
    // 기존 DB 전체 + infinite + room snapshot을 합쳐 재구성한다.
    const merged = [...cachedAllMessages, ...fromInfinite, ...fromRoom];

    if (!merged.length) return;

    const dedupedById = new Map<string, Message>();
    for (const msg of merged) {
      dedupedById.set(String(msg.id), msg);
    }

    const sorted = Array.from(dedupedById.values()).sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );
    const nextOldestCursor =
      roomInfiniteQuery.data?.pages.at(-1)?.nextCursor ??
      cachedOldestCursor ??
      null;

    if (!isSameMessageArray(cachedAllMessages, sorted)) {
      setCachedAllMessages(sorted);
      setCachedMessages(sorted.slice(-INITIAL_RENDER_WINDOW_SIZE));
    }
    setCachedOldestCursor(nextOldestCursor);

    void setChatRoomMessagesCache({
      key: `${CHAT_ROOM_MESSAGES_CACHE_KEY_PREFIX}${roomId}`,
      roomId,
      messages: sorted,
      updatedAt: Date.now(),
      validatedAt: Date.now(),
      oldestCursor: nextOldestCursor,
      newestMessageId: sorted.at(-1) ? String(sorted.at(-1)?.id) : null,
    });
  }, [
    roomId,
    cachedAllMessages,
    cachedOldestCursor,
    roomInfiniteQuery.data,
    roomQuery.data,
  ]);

  return {
    cachedMessages,
    hydrated,
    roomQuery,
    roomInfiniteQuery,
  };
}
