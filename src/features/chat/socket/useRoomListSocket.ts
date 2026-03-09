"use client";
import { useCallback, useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useSocketSubscription } from "@/core/socket/hooks/useSocketSubscribe";

import { useGetMyPageInfo } from "@/features/my-page";

import { chatQueries } from "../queries";
import { mergeRoomListSocketNotification } from "../services";
import { useChatRoomStore } from "../store";
import { ChatRoomListItemDto, isChatRoomUpdateMessage } from "../types";

export function useRoomListSocket() {
  const { data: userData } = useGetMyPageInfo();
  const queryClient = useQueryClient();

  const currentChatRoomId = useChatRoomStore((state) => state.focusingRoomId);
  const idRef = useRef<string>(currentChatRoomId);

  useEffect(() => {
    idRef.current = currentChatRoomId;
  }, [currentChatRoomId]);

  const receiveMessage = useCallback(
    (raw: unknown) => {
      if (!isChatRoomUpdateMessage(raw)) return;

      const listKey = chatQueries.roomList().queryKey;
      const oldData = queryClient.getQueryData<ChatRoomListItemDto[]>(listKey);
      const result = mergeRoomListSocketNotification(
        oldData,
        raw,
        idRef.current ?? undefined
      );

      if (result.kind === "noop") return;
      if (result.kind === "invalidate") {
        queryClient.invalidateQueries({ queryKey: listKey });
        return;
      }
      queryClient.setQueryData(listKey, result.rooms);
    },
    [queryClient]
  );

  useSocketSubscription({
    topic: `/sub/chat/notification/${userData?.username}`,
    onMessage: receiveMessage,
    enabled: !!userData?.username,
  });
}
