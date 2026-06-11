/**
 * STOMP `/sub/chat/...` 문자열 규약 (서버와 동일한 리터럴).
 *
 * Envelope의 `domainType`(CHAT/IMAGE)과 REST 타임라인 DTO의 `chatType`(TEXT/IMAGE/…)은
 * 이름이 비슷해도 다른 축이라 소켓 전용으로 둔다.
 */

/** 타임라인 envelope `content.chatType` — 일반 줄 / 입장 / 퇴장 */
export const CHAT_STOMP_INNER_CHAT_LINE_KINDS = ["CHAT", "ENTER", "LEAVE"] as const;
export type ChatStompInnerChatLineKind =
  (typeof CHAT_STOMP_INNER_CHAT_LINE_KINDS)[number];

/** Envelope 최상단 `domainType` — 스레드 도메인(CHAT/IMAGE 등) */
export const CHAT_STOMP_ENVELOPE_DOMAIN_TYPES = ["CHAT", "IMAGE"] as const;
export type ChatStompEnvelopeDomainType =
  (typeof CHAT_STOMP_ENVELOPE_DOMAIN_TYPES)[number];
