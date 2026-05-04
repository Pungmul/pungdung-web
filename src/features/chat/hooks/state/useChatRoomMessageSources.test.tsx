import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useChatRoomMessagesIndexedDB } from "./useChatRoomMessagesIndexedDB";
import { useChatRoomMessageSources } from "./useChatRoomMessageSources";

vi.mock("./useChatRoomMessagesIndexedDB", () => ({
  useChatRoomMessagesIndexedDB: vi.fn(),
}));

vi.mock("./useRefetchRoomInfiniteOnEntryPageSizeIncrease", () => ({
  useRefetchRoomInfiniteOnEntryPageSizeIncrease: vi.fn(),
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQuery: vi.fn(),
    useInfiniteQuery: vi.fn(),
  };
});

const mockedUseChatRoomMessagesIndexedDB = vi.mocked(
  useChatRoomMessagesIndexedDB
);
const mockedUseQuery = vi.mocked(useQuery);
const mockedUseInfiniteQuery = vi.mocked(useInfiniteQuery);

describe("useChatRoomMessageSources", () => {
  beforeEach(() => {
    mockedUseChatRoomMessagesIndexedDB.mockReset();
    mockedUseQuery.mockReset();
    mockedUseInfiniteQuery.mockReset();
  });

  it("computes readiness from room query success/fetching flags", () => {
    const fetchNextPage = vi.fn();
    mockedUseChatRoomMessagesIndexedDB.mockReturnValue({
      hydrated: true,
      messages: [],
      oldestCursor: null,
      listUnreadCountFromIdb: null,
    });
    mockedUseQuery.mockImplementation((options) => {
      const queryKey = options.queryKey as readonly string[];
      if (queryKey.includes("room-list")) {
        return {
          data: [],
          isSuccess: true,
          isFetching: false,
          isLoading: false,
        } as ReturnType<typeof useQuery>;
      }
      return {
        data: {
          chatRoomInfo: { group: true },
          userInfoList: [{ userId: 1, username: "me" }],
          userInitReadList: [{ userId: 1, lastReadMessageId: 100 }],
          messageList: { list: [] },
        },
        isSuccess: true,
        isFetching: false,
        isLoading: false,
      } as ReturnType<typeof useQuery>;
    });
    mockedUseInfiniteQuery.mockReturnValue({
      data: { pages: [], pageParams: [] },
      isLoading: false,
      fetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    } as unknown as ReturnType<typeof useInfiniteQuery>);

    const { result } = renderHook(() =>
      useChatRoomMessageSources({ roomId: "room-1", username: "me" })
    );

    expect(result.current.isRoomInfoReadyForEntrySnapshot).toBe(true);
    expect(result.current.fetchNextPage).toBe(fetchNextPage);
    expect(result.current.hasNextPage).toBe(true);
  });

  it("keeps room loading true before hydration", () => {
    mockedUseChatRoomMessagesIndexedDB.mockReturnValue({
      hydrated: false,
      messages: [],
      oldestCursor: null,
      listUnreadCountFromIdb: null,
    });
    mockedUseQuery.mockImplementation((options) => {
      const queryKey = options.queryKey as readonly string[];
      if (queryKey.includes("room-list")) {
        return {
          data: undefined,
          isSuccess: false,
          isFetching: true,
          isLoading: false,
        } as ReturnType<typeof useQuery>;
      }
      return {
        data: undefined,
        isSuccess: false,
        isFetching: true,
        isLoading: false,
      } as ReturnType<typeof useQuery>;
    });
    mockedUseInfiniteQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as unknown as ReturnType<typeof useInfiniteQuery>);

    const { result } = renderHook(() =>
      useChatRoomMessageSources({ roomId: "room-1", username: "me" })
    );

    expect(result.current.isRoomInfoReadyForEntrySnapshot).toBe(false);
    expect(result.current.isChatRoomLoading).toBe(true);
    expect(result.current.isInfiniteLoading).toBe(true);
  });
});
