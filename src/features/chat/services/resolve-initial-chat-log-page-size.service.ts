import { CHAT_LOG_PAGE_SIZE } from "../constants";

/** 초기 chatlog 요청 size 상한 (비정상 unread 폭주 방지) */
export const MAX_INITIAL_CHAT_LOG_PAGE_SIZE = 100;

/**
 * room list unreadCount 기준으로 첫 chatlog 페이지 size를 계산한다.
 * - unread 없음: 기본 페이지 크기
 * - unread 있음: unread 이상·기본 페이지 크기 이상 (상한 적용)
 */
export function resolveInitialChatLogPageSize(
  unreadCount: number | null | undefined
): number {
  const unread = Math.max(0, unreadCount ?? 0);
  if (unread === 0) {
    return CHAT_LOG_PAGE_SIZE;
  }

  return Math.min(
    Math.max(CHAT_LOG_PAGE_SIZE, unread),
    MAX_INITIAL_CHAT_LOG_PAGE_SIZE
  );
}
