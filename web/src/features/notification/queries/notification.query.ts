import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { acknowledgeNotificationList } from "../api/client/acknowledge-notification-list.api";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
} from "../api/client/fetch-notifications.api";

export const notificationQueries = {
  unreadCount: () =>
    queryOptions({
      queryKey: ["notificationCount"],
      queryFn: fetchUnreadNotificationCount,
      refetchOnMount: "always",
    }),
  list: () =>
    queryOptions({
      queryKey: ["notificationList"],
      queryFn: fetchNotifications,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
      gcTime: 0,
    }),
};

const notificationMutationRoot = ["notification", "mutation"] as const;

export const notificationMutationOptions = {
  acknowledgeList: () =>
    mutationOptions({
      mutationKey: [...notificationMutationRoot, "acknowledgeList"] as const,
      mutationFn: acknowledgeNotificationList,
    }),
};
