"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { chatQueries } from "../../../queries";
import {
  resetUnreadCountInRoomListIndexedDB,
  resolveRoomListUnreadResetCachePlan,
} from "../../../services";
import type { ChatRoomListItem } from "../../../types";

export function useApplyResetRoomUnreadCount() {
  const queryClient = useQueryClient();

  const applyResetRoomUnreadCount = useCallback(
    async (roomId: string) => {
      const listKey = chatQueries.roomList().queryKey;
      const prev = queryClient.getQueryData<ChatRoomListItem[]>(listKey);
      const plan = resolveRoomListUnreadResetCachePlan(prev, roomId);

      if (plan.kind === "invalidate") {
        await queryClient.invalidateQueries({ queryKey: listKey });
      } else if (plan.kind === "patch" && plan.changed) {
        queryClient.setQueryData<ChatRoomListItem[]>(listKey, plan.next);
      }

      await resetUnreadCountInRoomListIndexedDB(roomId);
    },
    [queryClient]
  );

  return { applyResetRoomUnreadCount };
}
