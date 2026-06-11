import type { FriendSearchHistoryEntry } from "../types";

/** 검색 기록 행 선택 시 입력창에 넣을 키워드 문자열 */
export function resolveSearchKeywordFromHistoryEntry(
  entry: FriendSearchHistoryEntry
): string {
  if (entry.type === "keyword") {
    return entry.keyword;
  }
  return entry.user.name;
}

export function isKeyboardActivationKey(key: string): boolean {
  return key === "Enter" || key === " ";
}
