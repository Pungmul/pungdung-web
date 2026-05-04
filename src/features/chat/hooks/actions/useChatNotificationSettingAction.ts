"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { chatMutationOptions, chatQueries } from "../../queries";
import { chatQueryInternal } from "../../queries/chat-query-internal";
import {
  patchRoomMuteInRoomList,
  patchRoomMuteInRoomListIndexedDB,
} from "../../services";
import type { ChatRoomListItem } from "../../types";

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

    queryClient.setQueryData<ChatRoomListItem[]>(
      chatQueries.roomList().queryKey,
      (prev) => {
        if (!prev?.length) {
          return prev;
        }

        const { next, changed } = patchRoomMuteInRoomList(prev, roomId, muted);
        return changed ? next : prev;
      }
    );

    await patchRoomMuteInRoomListIndexedDB(roomId, muted);
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
