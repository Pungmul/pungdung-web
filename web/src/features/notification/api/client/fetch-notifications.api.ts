import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import {
  notificationListDtoSchema,
  unreadNotificationCountDtoSchema,
} from "./dto.schema";
import { toNotificationData } from "../../lib/mappers";
import type { NotificationListItem } from "../../types";

export async function fetchUnreadNotificationCount(): Promise<number> {
  try {
    const proxyResponse = await fetch("/api/notification/notReadCnt", {
      credentials: "include",
      cache: "no-cache",
    });

    if (!proxyResponse.ok) {
      throw Error("서버 불안정" + proxyResponse.status);
    }

    const data = (await proxyResponse.json()) as { response?: unknown };
    const countDto = data?.response;
    return unreadNotificationCountDtoSchema.parse(countDto);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    throw error;
  }
}

export function fetchNotifications(): Promise<NotificationListItem[]> {
  return withResponseMapper({
    context: "GET /api/notification/messages",
    fetchDto: () =>
      clientApiRequest({
        url: "/api/notification/messages",
        method: "GET",
        responseSchema: notificationListDtoSchema,
      }),
    map: (items) => items.map(toNotificationData),
  });
}
