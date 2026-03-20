"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getChatRoomListCache, setChatRoomListCache } from "../../lib";
import { chatMutationOptions, chatQueries } from "../../queries";
import { chatQueryInternal } from "../../queries/chat-query-internal";
import type { ChatRoomListItem } from "../../types";
import { CHAT_ROOM_LIST_CACHE_KEY } from "../../types";

export function useChatNotificationSettingAction() {
  const queryClient = useQueryClient();
  const updateGlobalNotificationMutation = useMutation(
    chatMutationOptions.updateGlobalNotification()
  );
  const updateRoomNotificationMutation = useMutation(
    chatMutationOptions.updateRoomNotification()
  );

  const updateGlobalNotification = async (enabled: boolean) => {
    await updateGlobalNotificationMutation.mutateAsync({ enabled });
    await queryClient.invalidateQueries({
      queryKey: chatQueryInternal.roomNotifications(),
    });
  };

  const updateRoomNotification = async (roomId: string, muted: boolean) => {
    await updateRoomNotificationMutation.mutateAsync({
      roomId,
      body: { muted },
    });
    patchRoomMuteInRoomListCache(queryClient, roomId, muted);
    void patchRoomMuteInRoomListIndexedDB(roomId, muted);
    await queryClient.invalidateQueries({
      queryKey: chatQueries.roomNotification(roomId).queryKey,
    });
  };

  return {
    updateGlobalNotification,
    updateRoomNotification,
    isUpdatingGlobalNotification: updateGlobalNotificationMutation.isPending,
    isUpdatingRoomNotification: updateRoomNotificationMutation.isPending,
  };
}

function patchRoomMuteInRoomListCache(
  queryClient: ReturnType<typeof useQueryClient>,
  roomId: string,
  muted: boolean
) {
  queryClient.setQueryData<ChatRoomListItem[]>(
    chatQueries.roomList().queryKey,
    (prev) => {
      if (!prev?.length) return prev;

      let changed = false;
      const next = prev.map((room) => {
        if (room.chatRoomUUID !== roomId) return room;
        if (room.isMuted === muted) return room;
        changed = true;
        return { ...room, isMuted: muted };
      });

      return changed ? next : prev;
    }
  );
}

async function patchRoomMuteInRoomListIndexedDB(
  roomId: string,
  muted: boolean
) {
  const record = await getChatRoomListCache();
  if (!record?.rooms?.length) return;

  let changed = false;
  const rooms = record.rooms.map((room) => {
    if (room.chatRoomUUID !== roomId) return room;
    if (room.isMuted === muted) return room;
    changed = true;
    return { ...room, isMuted: muted };
  });

  if (!changed) return;

  await setChatRoomListCache({
    key: CHAT_ROOM_LIST_CACHE_KEY,
    rooms,
    updatedAt: record.updatedAt,
    validatedAt: record.validatedAt ?? Date.now(),
  });
}
