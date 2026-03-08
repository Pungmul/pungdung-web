/**
 * Chat React Query 키 — `queries/index.ts`로 공개하지 않고
 * `chat.query.ts` / `chat.mutation.ts`에서만 사용한다.
 */
const CHAT_QUERY_ROOT = ["chat"] as const;

export const chatQueryInternal = {
  all: () => [...CHAT_QUERY_ROOT],
  roomLists: () => [...CHAT_QUERY_ROOT, "room-list"] as const,
  rooms: () => [...CHAT_QUERY_ROOT, "room"] as const,
  room: (roomId: string) => [...chatQueryInternal.rooms(), roomId] as const,
  roomInfinites: () => [...CHAT_QUERY_ROOT, "room-infinite"] as const,
  roomInfinite: (roomId: string) =>
    [...chatQueryInternal.roomInfinites(), roomId] as const,
};
