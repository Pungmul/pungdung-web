"use client";

import { useEffect } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  notificationMutationOptions,
  notificationQueries,
} from "../../queries";

export function useAcknowledgeNotificationList() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    ...notificationMutationOptions.acknowledgeList(),
    onSuccess: () => {
      queryClient.setQueryData(notificationQueries.unreadCount().queryKey, 0);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);
}
