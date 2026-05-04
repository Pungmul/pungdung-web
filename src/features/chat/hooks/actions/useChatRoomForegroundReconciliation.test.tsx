import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useChatRoomForegroundReconciliation } from "./useChatRoomForegroundReconciliation";
import * as fetchGapService from "../../services/fetch-chat-room-message-gap.service";

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
    setDocumentHidden(false);
    vi.spyOn(fetchGapService, "fetchChatRoomMessageGap").mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setDocumentHidden(false);
  });

  it("백그라운드에서 포어그라운드로 돌아오면 gap 보정 후 readSign을 실행한다", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-20T00:00:00.000Z"));

    const queryClient = new QueryClient();
    const readSign = vi.fn();

    renderHook(
      () =>
        useChatRoomForegroundReconciliation({
          roomId: "room-1",
          readSign,
          isConnected: true,
        }),
      { wrapper: createWrapper(queryClient) }
    );

    act(() => {
      setDocumentHidden(true);
      document.dispatchEvent(new Event("visibilitychange"));
    });

    vi.setSystemTime(new Date("2026-05-20T00:00:01.000Z"));

    await act(async () => {
      setDocumentHidden(false);
      document.dispatchEvent(new Event("visibilitychange"));
      await Promise.resolve();
    });

    expect(fetchGapService.fetchChatRoomMessageGap).toHaveBeenCalledWith("room-1");
    expect(readSign).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("소켓 reconnect 시 gap 보정을 실행한다", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-20T00:00:00.000Z"));

    const queryClient = new QueryClient();
    const readSign = vi.fn();

    const { rerender } = renderHook(
      ({ isConnected }: { isConnected: boolean }) =>
        useChatRoomForegroundReconciliation({
          roomId: "room-1",
          readSign,
          isConnected,
        }),
      {
        wrapper: createWrapper(queryClient),
        initialProps: { isConnected: true },
      }
    );

    rerender({ isConnected: false });

    vi.setSystemTime(new Date("2026-05-20T00:00:01.000Z"));

    await act(async () => {
      rerender({ isConnected: true });
      await Promise.resolve();
    });

    expect(fetchGapService.fetchChatRoomMessageGap).toHaveBeenCalledWith("room-1");
    expect(readSign).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("visibilitychange와 pageshow가 연달아 발생해도 중복 보정하지 않는다", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-20T00:00:00.000Z"));

    const queryClient = new QueryClient();
    const readSign = vi.fn();

    renderHook(
      () =>
        useChatRoomForegroundReconciliation({
          roomId: "room-1",
          readSign,
          isConnected: true,
        }),
      { wrapper: createWrapper(queryClient) }
    );

    act(() => {
      setDocumentHidden(true);
      window.dispatchEvent(new Event("pagehide"));
      document.dispatchEvent(new Event("visibilitychange"));
    });

    vi.setSystemTime(new Date("2026-05-20T00:00:01.000Z"));

    await act(async () => {
      setDocumentHidden(false);
      document.dispatchEvent(new Event("visibilitychange"));
      window.dispatchEvent(new PageTransitionEvent("pageshow"));
      await Promise.resolve();
    });

    expect(fetchGapService.fetchChatRoomMessageGap).toHaveBeenCalledTimes(1);
    expect(readSign).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
