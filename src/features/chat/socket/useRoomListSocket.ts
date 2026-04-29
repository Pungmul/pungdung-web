"use client";
import { useCallback, useEffect, useRef } from "react";

import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { useSocketSubscription } from "@pungdung/worker-socket-bridge/react";

import { myPageQueries } from "@/features/my-page";

import { chatQueries } from "../queries";
import { mergeRoomListSocketNotification } from "../services";
import { useChatRoomStore } from "../store";

import { chatRoomUpdateMessageSchema } from "./socket-message.schema";
import type { ChatRoomListItem } from "../types/domain/chat-room.types";


export function useRoomListSocket() {
  const { data: userData } = useQuery(myPageQueries.info());
  const queryClient = useQueryClient();

  const currentChatRoomId = useChatRoomStore((state) => state.focusingRoomId);
  const idRef = useRef<string>(currentChatRoomId);

  useEffect(() => {
    idRef.current = currentChatRoomId;
  }, [currentChatRoomId]);

  const receiveMessage = useCallback(
    (raw: unknown) => {
      const parsed = chatRoomUpdateMessageSchema.safeParse(raw);
      if (!parsed.success) return;

      const listKey = chatQueries.roomList().queryKey;
      const oldData = queryClient.getQueryData<ChatRoomListItem[]>(listKey);
      const result = mergeRoomListSocketNotification(
        oldData,
        parsed.data,
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
