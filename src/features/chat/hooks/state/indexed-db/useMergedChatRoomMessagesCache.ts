"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { InfiniteData } from "@tanstack/react-query";

import { setChatRoomMessagesCache } from "../../../lib";
import { isSameMessageArray } from "../../../services";
import { mergeIndexedDBMessagesWithQueries } from "../../../services";
import { resolveLatestNumericMessageIdFromList } from "../../../services";
import { resolveOwnLastReadMessageIdFromChatRoom } from "../../../services";
import type { ChatLogCursorPage, ChatRoom, Message } from "../../../types";
import { CHAT_ROOM_MESSAGES_CACHE_KEY_PREFIX } from "../../../types";

type UseMergedChatRoomMessagesCacheParams = {
  roomId: string;
  username: string;
  hydrated: boolean;
  idbMessages: Message[];
  idbOldestCursor: number | null;
  roomData: ChatRoom | undefined;
  infiniteData: InfiniteData<ChatLogCursorPage, unknown> | undefined;
};

/**
 * IDB, room detail, infinite query에서 온 메시지를 렌더 가능한 단일 목록으로 병합한다.
 *
 * - Effect A: 소스 병합 후 `mergedAllMessages` state만 갱신
 * - Effect B: 병합 결과·cursor 변경 시 IndexedDB 메시지 cache를 persist
 */
export function useMergedChatRoomMessagesCache({
  roomId,
  username,
  hydrated,
  idbMessages,
  idbOldestCursor,
  roomData,
  infiniteData,
}: UseMergedChatRoomMessagesCacheParams) {
  const [mergedAllMessages, setMergedAllMessages] = useState<Message[]>([]);
  const lastPersistedOldestCursorRef = useRef<number | null>(null);
  const lastPersistedMessagesRef = useRef<Message[]>([]);

  useEffect(() => {
    lastPersistedOldestCursorRef.current = null;
    lastPersistedMessagesRef.current = [];
    setMergedAllMessages([]);
  }, [roomId]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    setMergedAllMessages(idbMessages);
  }, [hydrated, idbMessages, idbOldestCursor]);

  const oldestCursorForCache = useMemo(() => {
    if (roomData && username) {
      return resolveOwnLastReadMessageIdFromChatRoom(roomData, username);
    }
    return idbOldestCursor;
  }, [idbOldestCursor, roomData, username]);

  // Effect A: merge → setMergedAllMessages only (no IDB)
  useEffect(() => {
    const sorted = mergeIndexedDBMessagesWithQueries(
      mergedAllMessages,
      infiniteData?.pages?.flatMap((page) => page.messages) ?? [],
      roomData?.messageList?.list ?? []
    );

    if (!sorted.length) return;

    if (!isSameMessageArray(mergedAllMessages, sorted)) {
      setMergedAllMessages(sorted);
    }
  }, [mergedAllMessages, infiniteData, roomData]);

  // Effect B: persist to IndexedDB when messages/cursor change
  useEffect(() => {
    if (!mergedAllMessages.length) return;

    const messagesChanged = !isSameMessageArray(
      lastPersistedMessagesRef.current,
      mergedAllMessages
    );
    const cursorChanged =
      lastPersistedOldestCursorRef.current !== oldestCursorForCache;

    if (!messagesChanged && !cursorChanged) {
      return;
    }

    const newestMessageId =
      resolveLatestNumericMessageIdFromList(mergedAllMessages);
    const now = Date.now();
    lastPersistedOldestCursorRef.current = oldestCursorForCache;
    lastPersistedMessagesRef.current = mergedAllMessages;

    void setChatRoomMessagesCache({
      key: `${CHAT_ROOM_MESSAGES_CACHE_KEY_PREFIX}${roomId}`,
      roomId,
      messages: mergedAllMessages,
      updatedAt: now,
      validatedAt: now,
      oldestCursor: oldestCursorForCache,
      newestMessageId:
        newestMessageId === null ? null : String(newestMessageId),
    }).catch((error: unknown) => {
      console.error(
        "[useMergedChatRoomMessagesCache] Failed to persist messages cache",
        { roomId, error }
      );
    });
  }, [roomId, mergedAllMessages, oldestCursorForCache]);

  return mergedAllMessages;
}
