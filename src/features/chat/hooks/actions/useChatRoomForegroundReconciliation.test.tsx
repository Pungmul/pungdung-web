import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useChatRoomForegroundReconciliation } from "./useChatRoomForegroundReconciliation";
import { chatQueries } from "../../queries";

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

function setDocumentHidden(hidden: boolean) {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: hidden,
  });
}

describe("useChatRoomForegroundReconciliation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-20T00:00:00.000Z"));
    setDocumentHidden(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    setDocumentHidden(false);
  });

  it("백그라운드에서 포어그라운드로 돌아오면 readSign과 현재 방/목록 refetch를 실행한다", () => {
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();
    const readSign = vi.fn();

    renderHook(
      () =>
        useChatRoomForegroundReconciliation({
          roomId: "room-1",
          readSign,
        }),
      { wrapper: createWrapper(queryClient) }
    );

    act(() => {
      setDocumentHidden(true);
      document.dispatchEvent(new Event("visibilitychange"));
    });

    vi.setSystemTime(new Date("2026-05-20T00:00:01.000Z"));

    act(() => {
      setDocumentHidden(false);
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(readSign).toHaveBeenCalledTimes(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: chatQueries.room("room-1").queryKey,
      exact: true,
      refetchType: "active",
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: chatQueries.roomList().queryKey,
      exact: true,
      refetchType: "active",
    });
    expect(invalidateQueriesSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: chatQueries.roomInfinite("room-1").queryKey,
      })
    );
  });

  it("visibilitychange와 pageshow가 연달아 발생해도 중복 refetch하지 않는다", () => {
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();
    const readSign = vi.fn();

    renderHook(
      () =>
        useChatRoomForegroundReconciliation({
          roomId: "room-1",
          readSign,
        }),
      { wrapper: createWrapper(queryClient) }
    );

    act(() => {
      setDocumentHidden(true);
      window.dispatchEvent(new Event("pagehide"));
      document.dispatchEvent(new Event("visibilitychange"));
    });

    vi.setSystemTime(new Date("2026-05-20T00:00:01.000Z"));

    act(() => {
      setDocumentHidden(false);
      document.dispatchEvent(new Event("visibilitychange"));
      window.dispatchEvent(new PageTransitionEvent("pageshow"));
    });

    expect(readSign).toHaveBeenCalledTimes(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
  });
});
