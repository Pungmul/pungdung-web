import { mutationOptions, queryOptions } from "@tanstack/react-query";

import {
  fetchUnreadNotificationCount,
  fetchUnreadNotifications,
} from "../api/client/fetch-unread-notifications.api";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../api/client/read-notification.api";

export const notificationQueries = {
  unreadCount: () =>
    queryOptions({
      queryKey: ["notificationCount"],
      queryFn: fetchUnreadNotificationCount,
      refetchOnMount: "always",
    }),
  unreadList: () =>
    queryOptions({
      queryKey: ["notificationList"],
      queryFn: fetchUnreadNotifications,
      refetchOnMount: "always",
    }),
};

const notificationMutationRoot = ["notification", "mutation"] as const;

export const notificationMutationOptions = {
  markOneAsRead: () =>
    mutationOptions({
      mutationKey: [...notificationMutationRoot, "markOneAsRead"] as const,
      mutationFn: markNotificationAsRead,
    }),
  markAllAsRead: () =>
    mutationOptions({
      mutationKey: [...notificationMutationRoot, "markAllAsRead"] as const,
      mutationFn: markAllNotificationsAsRead,
    }),
};
