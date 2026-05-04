"use client";

import { useMemo, useRef } from "react";

import { useQuery } from "@tanstack/react-query";

import { chatQueries } from "../../queries";
import { resolveEntryUnreadCountHint } from "../../services/resolve-entry-unread-count-hint.service";
import { resolveInitialChatLogPageSize } from "../../services/resolve-initial-chat-log-page-size.service";

type UseEntryInitialChatLogPageSizeParams = {
  roomId: string;
  hydrated: boolean;
  listUnreadCountFromIdb: number | null;
};

/**
 * 채팅방 진입 시 사용할 첫 채팅 로그 page size를 계산한다.
 *
 * IDB와 room-list query의 unread count 중 큰 값을 기준으로 산정하며,
 * 같은 room 안에서는 더 작은 page size로 줄어들지 않도록 고정한다.
 */
export function useEntryInitialChatLogPageSize({
  roomId,
  hydrated,
  listUnreadCountFromIdb,
}: UseEntryInitialChatLogPageSizeParams) {
  const roomPageSizeRef = useRef<{
    roomId: string;
    frozenInitialPageSize?: number;
  }>({ roomId });

  if (roomPageSizeRef.current.roomId !== roomId) {
    roomPageSizeRef.current = { roomId };
  }

  const roomListQuery = useQuery({
    ...chatQueries.roomList(),
    enabled: hydrated,
  });

  return useMemo(() => {
    const unread = resolveEntryUnreadCountHint(
      listUnreadCountFromIdb,
      roomListQuery.data,
      roomId
    );
    const next = resolveInitialChatLogPageSize(unread > 0 ? unread : null);
    const frozen = roomPageSizeRef.current.frozenInitialPageSize;

    if (frozen === undefined || next > frozen) {
      roomPageSizeRef.current.frozenInitialPageSize = next;
      return next;
    }

    return frozen;
  }, [listUnreadCountFromIdb, roomId, roomListQuery.data]);
}
