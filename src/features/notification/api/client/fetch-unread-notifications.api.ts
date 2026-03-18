import {
  unreadNotificationCountDtoSchema,
  unreadNotificationListDtoSchema,
} from "./dto.schema";
import { toNotificationData } from "../../lib/mappers";
import type { UnreadNotificationData } from "../../types";

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

export async function fetchUnreadNotifications(): Promise<UnreadNotificationData[]> {
  try {
    const proxyResponse = await fetch("/api/notification/notReadMessage", {
      credentials: "include",
    });

    if (!proxyResponse.ok) {
      throw Error("서버 불안정" + proxyResponse.status);
    }

    const data = (await proxyResponse.json()) as { response?: unknown };
    const messagesDto = data?.response;
    return unreadNotificationListDtoSchema
      .parse(messagesDto)
      .map(toNotificationData);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    throw error;
  }
}
