import { z } from "zod";

import {
  CHAT_STOMP_ENVELOPE_DOMAIN_TYPES,
  CHAT_STOMP_INNER_CHAT_LINE_KINDS,
} from "./stomp-chat.constants";

/**
 * 방 목록 알림(`/sub/chat/notification/...`).
 * `type === "READ"`인 경우 서버가 `timestamp`/`content` 없이 보낼 수 있다.
 */
const chatRoomUpdateReadSchema = z.object({
  chatRoomUUID: z.string(),
  type: z.literal("READ"),
});

const chatRoomUpdateNotificationSchema = z.object({
  chatRoomUUID: z.string(),
  timestamp: z.string(),
  content: z.union([z.string(), z.null()]),
  type: z.string().optional(),
  unreadCount: z.union([z.number(), z.null()]).optional(),
});

export const chatRoomUpdateMessageSchema = z.union([
  chatRoomUpdateReadSchema,
  chatRoomUpdateNotificationSchema,
]);

export type ChatRoomUpdateMessage = z.infer<typeof chatRoomUpdateMessageSchema>;

const readSocketMessageContentSchema = z.object({
  userId: z.number(),
  messageIds: z.array(z.number()),
  readAt: z.string(),
});

/** `/sub/chat/read/:roomId` 읽음 브로드캐스트 */
export const readSocketMessageSchema = z.object({
  messageLogId: z.number(),
  domainType: z.string(),
  businessIdentifier: z.string(),
  identifier: z.string(),
  stompDest: z.string(),
  content: readSocketMessageContentSchema,
});

export type ReadSocketMessage = z.infer<typeof readSocketMessageSchema>;

/** `/sub/chat/alarm/:roomId` — envelope는 타임라인과 같고 `content`만 문자열 */
export const stompAlarmEnvelopeSchema = z.object({
  messageLogId: z.number(),
  domainType: z.literal("CHAT"),
  businessIdentifier: z.string(),
  identifier: z.string(),
  stompDest: z.string(),
  content: z.string(),
});

export type StompAlarmEnvelope = z.infer<typeof stompAlarmEnvelopeSchema>;

const stompTimelineInnerSchema = z.object({
  id: z.number(),
  senderUsername: z.string(),
  content: z.string(),
  chatType: z.enum(CHAT_STOMP_INNER_CHAT_LINE_KINDS),
  imageUrl: z.union([z.string(), z.null()]),
  chatRoomUUID: z.string(),
  createdAt: z.string(),
});

/** `/sub/chat/message/:roomId` 타임라인 STOMP envelope */
export const stompTimelineMessageEnvelopeSchema = z.object({
  messageLogId: z.number(),
  domainType: z.enum(CHAT_STOMP_ENVELOPE_DOMAIN_TYPES),
  businessIdentifier: z.string(),
  identifier: z.string(),
  stompDest: z.string(),
  content: stompTimelineInnerSchema,
});

export type StompTimelineMessageEnvelope = z.infer<
  typeof stompTimelineMessageEnvelopeSchema
>;
