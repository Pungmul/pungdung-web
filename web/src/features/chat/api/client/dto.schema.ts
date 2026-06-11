import { z } from "zod";

/** 채팅 로그/방 상세에 포함되는 단일 메시지(REST 응답) */
const messageTextDtoSchema = z.object({
  id: z.union([z.number(), z.string()]),
  clientId: z.string().nullable().optional(),
  senderUsername: z.string(),
  content: z.string(),
  chatType: z.literal("TEXT"),
  imageUrlList: z.null(),
  chatRoomUUID: z.string(),
  createdAt: z.string(),
});

const messageImageDtoSchema = z.object({
  id: z.union([z.number(), z.string()]),
  clientId: z.string().nullable().optional(),
  senderUsername: z.string(),
  content: z.null(),
  chatType: z.literal("IMAGE"),
  imageUrlList: z.array(z.string()),
  chatRoomUUID: z.string(),
  createdAt: z.string(),
});

const messageLeaveDtoSchema = z.object({
  id: z.union([z.number(), z.string()]),
  clientId: z.string().nullable().optional(),
  senderUsername: z.string(),
  /** REST는 시스템 문구 문자열, STOMP/구버전은 null일 수 있음 */
  content: z.string().nullable(),
  chatType: z.literal("LEAVE"),
  imageUrlList: z.null(),
  chatRoomUUID: z.string(),
  createdAt: z.string(),
});

const messageJoinDtoSchema = z.object({
  id: z.union([z.number(), z.string()]),
  clientId: z.string().nullable().optional(),
  senderUsername: z.string(),
  content: z.string(),
  chatType: z.literal("JOIN"),
  imageUrlList: z.null(),
  chatRoomUUID: z.string(),
  createdAt: z.string(),
});

export const messageDtoSchema = z.discriminatedUnion("chatType", [
  messageTextDtoSchema,
  messageImageDtoSchema,
  messageLeaveDtoSchema,
  messageJoinDtoSchema,
]);

export type MessageDto = z.infer<typeof messageDtoSchema>;

/** 커서 기반 메시지 페이지 공통 shape (messages, hasMore, nextCursor) */
export const chatMessageCursorPageDtoSchema = z.object({
  messages: z.array(messageDtoSchema),
  hasMore: z.boolean(),
  nextCursor: z.coerce.number().nullable().optional(),
});

export type ChatMessageCursorPageDto = z.infer<
  typeof chatMessageCursorPageDtoSchema
>;

/** GET .../message — 커서 페이지(최신→오래된 순). `chatMessageCursorPageDtoSchema`와 동일 참조. */
export const chatLogCursorPageDtoSchema = chatMessageCursorPageDtoSchema;

export type ChatLogCursorPageDto = ChatMessageCursorPageDto;

/** GET .../chat-room/:roomId — 방 상세 `messageList` 필드. `chatMessageCursorPageDtoSchema`와 동일 참조. */
export const messageListDtoSchema = chatMessageCursorPageDtoSchema;

export type MessageListDto = ChatMessageCursorPageDto;

export const chatRoomInfoDtoSchema = z.object({
  chatRoomUUID: z.string(),
  roomName: z.string(),
  profileImageUrl: z.string().nullable(),
  group: z.boolean(),
});

export type ChatRoomInfoDto = z.infer<typeof chatRoomInfoDtoSchema>;

const profileImageDtoSchema = z.object({
  id: z.number(),
  originalFilename: z.string(),
  convertedFileName: z.string(),
  fullFilePath: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  createdAt: z.string(),
});

export const chatRoomUserDtoSchema = z
  .object({
    userId: z.number(),
    username: z.string(),
    name: z.string(),
    clubName: z.string().nullable().optional(),
    groupName: z.string().nullable().optional(),
    profileImage: profileImageDtoSchema,
  })
  .passthrough();

export type ChatRoomUserDto = z.infer<typeof chatRoomUserDtoSchema>;

export const userLastReadMessageIdDtoSchema = z.object({
  userId: z.number(),
  lastReadMessageId: z.number().nullable(),
});

export type UserLastReadMessageIdDto = z.infer<
  typeof userLastReadMessageIdDtoSchema
>;

export const chatRoomDtoSchema = z.object({
  chatRoomInfo: chatRoomInfoDtoSchema,
  userInfoList: z.array(chatRoomUserDtoSchema),
  messageList: messageListDtoSchema,
  userInitReadList: z.array(userLastReadMessageIdDtoSchema),
});

export type ChatRoomDto = z.infer<typeof chatRoomDtoSchema>;

export const chatRoomListItemDtoSchema = z
  .object({
    chatRoomUUID: z.string(),
    isMuted: z.boolean().optional(),
    muted: z.boolean().optional(),
    lastMessageTime: z.string().nullable(),
    lastMessageContent: z.string().nullable(),
    unreadCount: z.number().nullable(),
    senderId: z.number().nullable(),
    senderName: z.string().nullable(),
    receiverId: z.number().nullable(),
    receiverName: z.string().nullable(),
    /** 백엔드가 빈/미로딩 상태에서 null을 줄 수 있음 */
    chatRoomMemberIds: z
      .array(z.number())
      .nullish()
      .transform((v) => v ?? []),
    chatRoomMemberNames: z
      .array(z.string())
      .nullish()
      .transform((v) => v ?? []),
    roomName: z.string(),
    profileImageUrl: z.string().nullable(),
    group: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (
      typeof value.isMuted === "boolean" ||
      typeof value.muted === "boolean"
    ) {
      return;
    }
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either isMuted or muted must be provided",
      path: ["isMuted"],
    });
  })
  .transform(({ muted: _muted, ...rest }) => ({
    ...rest,
    isMuted: rest.isMuted ?? _muted ?? false,
  }));

export type ChatRoomListItemDto = z.infer<typeof chatRoomListItemDtoSchema>;

export const chatNotificationEnabledDtoSchema = z.object({
  enabled: z.boolean(),
});

export type ChatNotificationEnabledDto = z.infer<
  typeof chatNotificationEnabledDtoSchema
>;

export const chatRoomNotificationMutedDtoSchema = z.object({
  muted: z.boolean(),
});

export type ChatRoomNotificationMutedDto = z.infer<
  typeof chatRoomNotificationMutedDtoSchema
>;

export const chatRoomNotificationStateDtoSchema = z
  .object({
    isMuted: z.boolean().optional(),
    muted: z.boolean().optional(),
    globalEnabled: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (
      typeof value.isMuted === "boolean" ||
      typeof value.muted === "boolean"
    ) {
      return;
    }
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either isMuted or muted must be provided",
      path: ["isMuted"],
    });
  })
  .transform(({ muted: _muted, ...rest }) => ({
    ...rest,
    isMuted: rest.isMuted ?? _muted ?? false,
  }));

export type ChatRoomNotificationStateDto = z.infer<
  typeof chatRoomNotificationStateDtoSchema
>;

/** 초대·퇴장·메시지 전송 등 성공 시 envelope.response — 업스트림이 null·객체 등 혼재할 수 있음 */
export const chatMutationVoidResponseSchema = z
  .unknown()
  .transform(() => undefined);

export const chatRoomListResponseEnvelopeSchema = z.object({
  list: z.array(chatRoomListItemDtoSchema),
});

/** 채팅방 생성 등에서 `isSuccess: false`로 내려오는 백엔드 실패 본문 (예: CHAT-009 요청 횟수 초과) */
export const createChatRoomFailureDtoSchema = z.object({
  code: z.string(),
  message: z.string(),
  response: z.null(),
  isSuccess: z.literal(false),
});

export type CreateChatRoomFailureDto = z.infer<
  typeof createChatRoomFailureDtoSchema
>;

export const createChatRoomSuccessDtoSchema = z
  .object({
    roomUUID: z.string(),
  })
  .passthrough();

export type CreateChatRoomSuccessDto = z.infer<
  typeof createChatRoomSuccessDtoSchema
>;

export const createChatRoomResponseDtoSchema = z.union([
  createChatRoomFailureDtoSchema,
  createChatRoomSuccessDtoSchema,
]);

export type CreateChatRoomResponseDto = z.infer<
  typeof createChatRoomResponseDtoSchema
>;

export function isCreateChatRoomFailure(
  value: CreateChatRoomResponseDto
): value is CreateChatRoomFailureDto {
  return "isSuccess" in value && value.isSuccess === false;
}
