import { z } from "zod";

export const unreadNotificationCountDtoSchema = z.number();

const notificationRelatedIdSchema = z.string();

// FCM 알림 data 필드 JSON 파싱 결과
// GET /api/message/fcm/messages, 프록시 /api/notification/messages
export const fcmNotificationDataSchema = z.looseObject({
  sentAt: z.string().optional(),
  unreadCount: z.string().optional(),
  chatRoomUUID: z.string().optional(),
  type: z.string().nullish(),
  relatedId: notificationRelatedIdSchema.nullish(),
});

export type FcmNotificationDataDto = z.infer<
  typeof fcmNotificationDataSchema
>;

function parseNotificationDataField(raw: unknown): unknown {
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

  const parsed = fcmNotificationDataSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

// 최근 10일 알림 1건
// isRead는 목록 확인(PATCH /read) 이전 도착 여부
export const notificationItemDtoSchema = z.looseObject({
  id: z.coerce.number(),
  title: z.string(),
  body: z.string().nullable().optional(),
  type: z.string().nullish(),
  relatedId: notificationRelatedIdSchema.nullish(),
  isRead: z.boolean(),
  sentAt: z.string(),
  domainType: z.string(),
  data: z
    .preprocess(
      parseNotificationDataField,
      fcmNotificationDataSchema.nullable()
    )
    .nullish(),
});

export const notificationListDtoSchema = z.array(notificationItemDtoSchema);

export type NotificationItemDto = z.infer<typeof notificationItemDtoSchema>;

export const notificationMutationVoidResponseSchema = z
  .unknown()
  .transform(() => undefined);
