"use client";

import { useEffect, useState } from "react";

import { getChatRoomListCache, getChatRoomMessagesCache } from "../../lib";
import { resolveUnreadCountFromRoomList } from "../../services/resolve-unread-count-from-room-list.service";
import type { Message } from "../../types";

export function useChatRoomMessagesIndexedDB(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [oldestCursor, setOldestCursor] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [listUnreadCountFromIdb, setListUnreadCountFromIdb] = useState<
    number | null
  >(null);

  useEffect(() => {
    let active = true;
    setHydrated(false);
    setMessages([]);
    setOldestCursor(null);
    setListUnreadCountFromIdb(null);

    void Promise.all([getChatRoomMessagesCache(roomId), getChatRoomListCache()])
      .then(([messagesRecord, listRecord]) => {
        if (!active) return;

        if (messagesRecord) {
          const safeMessages = Array.isArray(messagesRecord.messages)
            ? messagesRecord.messages
            : [];
          setMessages(safeMessages);
          setOldestCursor(messagesRecord.oldestCursor ?? null);
        }

        setListUnreadCountFromIdb(
          resolveUnreadCountFromRoomList(listRecord?.rooms, roomId)
        );
      })
      .finally(() => {
        if (active) setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, [roomId]);

  return {
    hydrated,
    messages,
    oldestCursor,
    listUnreadCountFromIdb,
  };
}
