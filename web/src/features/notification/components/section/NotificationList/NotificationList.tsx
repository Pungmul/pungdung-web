"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { NotificationListView } from "./NotificationListView";
import { useAcknowledgeNotificationList } from "../../../hooks/actions";
import { notificationQueries } from "../../../queries";

export function NotificationList() {
  const { data: notifications } = useSuspenseQuery(notificationQueries.list());
  useAcknowledgeNotificationList();

  return <NotificationListView notifications={notifications} />;
}
