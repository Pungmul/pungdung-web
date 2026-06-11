import type { OpenUserProfilePayload } from "@/features/user/types";

/**
 * `/api/friends/load`·`/api/friends/search` 등에서 오는 `friendStatus` 문자열과 동일한 계약을 전제로 한다.
 * (@see `friendsLoadResponseSchema`, `friendRequestInfoDtoSchema`)
 */
export type FriendApiRelationKind =
  | "ACCEPTED"
  | "SEND"
  | "RECEIVE"
  | "NONE"
  | "UNKNOWN";

export function parseFriendApiRelationKind(
  status: string
): FriendApiRelationKind {
  const normalized = status.trim().toUpperCase();
  if (
    normalized === "ACCEPTED" ||
    normalized === "SEND" ||
    normalized === "RECEIVE" ||
    normalized === "NONE"
  ) {
    return normalized;
  }
  return "UNKNOWN";
}

/** 프로필 모달 `relationship` — 검색/로드 API status 와 동일 규칙 */
export function mapFriendStatusToProfileRelationship(
  friendStatus: string
): OpenUserProfilePayload["relationship"] {
  switch (parseFriendApiRelationKind(friendStatus)) {
    case "ACCEPTED":
      return "friend";
    case "SEND":
      return "pending_out";
    case "RECEIVE":
      return "pending_in";
    default:
      return "none";
  }
}

/** 검색 결과 행 등 보조 설명 — 배지·버튼과 중복 최소화 */
export function mapFriendStatusToRelationHint(friendStatus: string): string {
  switch (parseFriendApiRelationKind(friendStatus)) {
    case "ACCEPTED":
      return "친구";
    case "SEND":
      return "요청 보냄";
    case "RECEIVE":
      return "요청 받음";
    default:
      return "";
  }
}
