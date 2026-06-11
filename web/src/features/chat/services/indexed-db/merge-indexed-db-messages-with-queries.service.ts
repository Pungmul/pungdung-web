import { sortMessagesOldestFirst } from "../../lib/message/compare-message-order";
import type { Message } from "../../types";
import { isSameMessageArray } from "../message/is-same-message-array.service";

/**
 * IndexedDB 전체 캐시, infinite query 페이지, room snapshot 세 소스를 병합합니다.
 * - ID 기준 dedup 후 canonical comparator 기준 oldest-first 정렬
 * - 세 소스 모두 비어 있으면 빈 배열을 반환합니다.
 *
 * React Query cache 반영(`setChatRoomMessagesCache`)은 호출부에서 합니다.
 */
export function mergeIndexedDBMessagesWithQueries(
  cachedAll: Message[],
  fromInfinite: Message[],
  fromRoom: Message[]
): Message[] {
  if (
    isSameMessageArray(cachedAll, fromInfinite) &&
    isSameMessageArray(cachedAll, fromRoom)
  ) {
    return cachedAll;
  }

  const merged = [...cachedAll, ...fromInfinite, ...fromRoom];
  if (!merged.length) return [];

  const dedupedById = new Map<string, Message>();
  for (const msg of merged) {
    dedupedById.set(String(msg.id), msg);
  }

  return sortMessagesOldestFirst(Array.from(dedupedById.values()));
}
