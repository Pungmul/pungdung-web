import type { Message } from "./domain/chat-message.types";

/**
 * 전송 대기 중이거나 실패한 메시지의 상태
 */
export type PendingMessageState = "pending" | "failed";

/**
 * 전송 대기 중인 메시지 타입
 * - pending: 전송 중
 * - failed: 전송 실패
 */
export type PendingMessage = Message & {
  state: PendingMessageState;
};

/**
 * 유저별 마지막 읽은 메시지 ID 맵
 * key: username
 * value: lastReadMessageId (null이면 읽은 메시지 없음)
 */
export type UserLastReadMessageIdMap = Record<string, number | null>;

/**
 * 유저별 프로필 이미지 맵
 * key: username
 * value: 프로필 이미지 URL (빈 문자열이면 기본 이미지)
 */
export type UserImageMap = Record<string, string | null>;

/**
 * 유저별 이름 맵
 * key: username
 * value: 표시 이름
 */
export type UserNameMap = Record<string, string | null>;

/**
 * 채팅방 유저 관련 맵들을 묶은 타입
 */
export interface ChatRoomUserMaps {
  userLastReadMessageIdMap: UserLastReadMessageIdMap;
  userImageMap: UserImageMap;
  userNameMap: UserNameMap;
}
