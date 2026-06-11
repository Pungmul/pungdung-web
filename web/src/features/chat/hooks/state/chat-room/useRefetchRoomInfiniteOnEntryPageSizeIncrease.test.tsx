import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { loadChatLogs } from "../../../api";
import { CHAT_LOG_PAGE_SIZE } from "../../../constants";
import { chatQueries } from "../../../queries";

import { useRefetchRoomInfiniteOnEntryPageSizeIncrease } from "./useRefetchRoomInfiniteOnEntryPageSizeIncrease";

vi.mock("../../../api", () => ({
  loadChatLogs: vi.fn(),
}));

const mockedLoadChatLogs = vi.mocked(loadChatLogs);
const fetchInfiniteQuery = vi.fn();

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQueryClient: () => ({
      fetchInfiniteQuery,
    }),
  };
});

describe("useRefetchRoomInfiniteOnEntryPageSizeIncrease", () => {
  beforeEach(() => {
    fetchInfiniteQuery.mockReset();
    fetchInfiniteQuery.mockResolvedValue({
      pages: [],
      pageParams: [],
    });
    mockedLoadChatLogs.mockReset();
    mockedLoadChatLogs.mockResolvedValue({
      messages: [],
      hasMore: false,
      nextCursor: null,
    });
  });

  it("entryInitialChatLogPageSize가 커지면 staleTime 0으로 fresh fetch한다", async () => {
    const roomId = "room-1";
    const increasedPageSize = 35;

    const { rerender } = renderHook(
      (props) => useRefetchRoomInfiniteOnEntryPageSizeIncrease(props),
      {
        initialProps: {
          roomId,
          hydrated: true,
          entryInitialChatLogPageSize: CHAT_LOG_PAGE_SIZE,
        },
      }
    );

    await act(async () => {
      rerender({
        roomId,
        hydrated: true,
        entryInitialChatLogPageSize: increasedPageSize,
      });
      await Promise.resolve();
    });

    expect(fetchInfiniteQuery).toHaveBeenCalledTimes(1);

    const [callArg] = fetchInfiniteQuery.mock.calls[0] as [
      ReturnType<typeof chatQueries.roomInfinite> & { staleTime: number },
    ];
    expect(callArg.staleTime).toBe(0);
    expect(callArg.queryKey).toEqual(
      chatQueries.roomInfinite(roomId).queryKey
    );
    expect(callArg.queryFn).toBeDefined();
    await callArg.queryFn!({ pageParam: undefined } as never);
    expect(mockedLoadChatLogs).toHaveBeenCalledWith(
      roomId,
      undefined,
      increasedPageSize
    );
  });

  it("pageSize가 같거나 줄어들면 fetch하지 않는다", async () => {
    const roomId = "room-1";

    const { rerender } = renderHook(
      (props) => useRefetchRoomInfiniteOnEntryPageSizeIncrease(props),
      {
        initialProps: {
          roomId,
          hydrated: true,
          entryInitialChatLogPageSize: CHAT_LOG_PAGE_SIZE,
        },
      }
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      rerender({
        roomId,
        hydrated: true,
        entryInitialChatLogPageSize: CHAT_LOG_PAGE_SIZE,
      });
      await Promise.resolve();
    });

    await act(async () => {
      rerender({
        roomId,
        hydrated: true,
        entryInitialChatLogPageSize: CHAT_LOG_PAGE_SIZE - 1,
      });
      await Promise.resolve();
    });

    expect(fetchInfiniteQuery).not.toHaveBeenCalled();
  });

  it("hydrated가 false이면 fetch하지 않는다", async () => {
    renderHook(() =>
      useRefetchRoomInfiniteOnEntryPageSizeIncrease({
        roomId: "room-1",
        hydrated: false,
        entryInitialChatLogPageSize: 35,
      })
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(fetchInfiniteQuery).not.toHaveBeenCalled();
  });
});
