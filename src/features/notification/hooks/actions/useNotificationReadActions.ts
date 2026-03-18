"use client";

import { useCallback } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  notificationMutationOptions,
  notificationQueries,
} from "../../queries";

export function useNotificationReadActions() {
  const queryClient = useQueryClient();

  const markOneAsReadMutation = useMutation({
    ...notificationMutationOptions.markOneAsRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationQueries.unreadList().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: notificationQueries.unreadCount().queryKey,
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    ...notificationMutationOptions.markAllAsRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationQueries.unreadList().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: notificationQueries.unreadCount().queryKey,
      });
    },
  });

  const handleReadNotification = useCallback(
    (logId: number) => {
      markOneAsReadMutation.mutate(logId);
    },
    [markOneAsReadMutation]
  );

  const handleReadAllNotifications = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  return {
    handleReadNotification,
    handleReadAllNotifications,
  };
}
