import { z } from "zod";

export const unreadNotificationCountDtoSchema = z.number();

/**
 * FCM unread 로그의 `data` 필드(JSON 문자열)를 파싱한 페이로드.
 * @see GET `/api/message/fcm/unread` (프록시: `/api/notification/notReadMessage`)
 */
export const fcmUnreadNotificationDataSchema = z.looseObject({
  sentAt: z.string().optional(),
  unreadCount: z.string().optional(),
  chatRoomUUID: z.string().optional(),
});

export type FcmUnreadNotificationDataDto = z.infer<
  typeof fcmUnreadNotificationDataSchema
>;

function parseUnreadNotificationDataField(raw: unknown): unknown {
  if (raw == null) return null;

  let candidate: unknown = raw;

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed === "") return null;
    try {
      candidate = JSON.parse(trimmed) as unknown;
    } catch {
      return null;
    }
  }

  if (typeof candidate !== "object" || candidate === null) {
    return null;
  }

  const parsed = fcmUnreadNotificationDataSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

/** 단일 FCM 미읽음 알림 로그 (업스트림 row). */
export const unreadNotificationItemDtoSchema = z.looseObject({
  id: z.coerce.number(),
  receiverId: z.coerce.number(),
  token: z.string(),
  title: z.string(),
  body: z.string().nullable().optional(),
  data: z.preprocess(
    parseUnreadNotificationDataField,
    fcmUnreadNotificationDataSchema.nullable()
  ),
  isRead: z.boolean(),
  sentAt: z.string(),
  status: z.string(),
  response: z.unknown().nullable().optional(),
  domainType: z.string(),
});

export const unreadNotificationListDtoSchema = z.array(
  unreadNotificationItemDtoSchema
);

export type UnreadNotificationItemDto = z.infer<
  typeof unreadNotificationItemDtoSchema
>;

export const notificationMutationVoidResponseSchema = z
  .unknown()
  .transform(() => undefined);
