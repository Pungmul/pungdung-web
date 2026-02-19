import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebouncedFetchNextPage } from "./useDebouncedFetchNextPage";

describe("useDebouncedFetchNextPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("hasNextPage가 true이고 fetching 중이 아니면 loadMore가 fetchNextPage를 호출한다", async () => {
    const fetchNextPage = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useDebouncedFetchNextPage({
        fetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      })
    );

    await act(async () => {
      result.current.loadMore();
    });

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("hasNextPage가 false이면 loadMore는 fetchNextPage를 호출하지 않는다", async () => {
    const fetchNextPage = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useDebouncedFetchNextPage({
        fetchNextPage,
        hasNextPage: false,
        isFetchingNextPage: false,
      })
    );

    await act(async () => {
      result.current.loadMore();
    });

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it("isFetchingNextPage가 true이면 loadMore는 fetchNextPage를 호출하지 않는다", async () => {
    const fetchNextPage = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useDebouncedFetchNextPage({
        fetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: true,
      })
    );

    await act(async () => {
      result.current.loadMore();
    });

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it("디바운스 윈도우 안의 연속 loadMore는 추가 호출을 만들지 않는다", async () => {
    const fetchNextPage = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useDebouncedFetchNextPage({
        fetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      })
    );

    await act(async () => {
      result.current.loadMore();
      result.current.loadMore();
    });

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("윈도우가 지난 뒤 loadMore는 다시 fetchNextPage를 호출한다", async () => {
    const fetchNextPage = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useDebouncedFetchNextPage({
        fetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      })
    );

    await act(async () => {
      result.current.loadMore();
    });
    expect(fetchNextPage).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    await act(async () => {
      result.current.loadMore();
    });

    expect(fetchNextPage).toHaveBeenCalledTimes(2);
  });
});
