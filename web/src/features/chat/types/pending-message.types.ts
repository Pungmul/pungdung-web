import type { Message } from "./chat-message.types";

/**
 * 전송 대기 중인 메시지 타입
 * - pending: 전송 중
 * - failed: 전송 실패
 */
export type PendingMessage = Message & {
  clientId?: string;
  state: "pending" | "failed";
};

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
