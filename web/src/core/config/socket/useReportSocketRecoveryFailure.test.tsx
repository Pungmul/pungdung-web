import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  state: { phase: "connecting", error: undefined as string | undefined },
  listeners: new Set<() => void>(),
  captureException: vi.fn(),
  setTag: vi.fn(),
  setFingerprint: vi.fn(),
  setExtras: vi.fn(),
  setLevel: vi.fn(),
}));

vi.mock("@sentry/nextjs", () => ({
  captureException: mocks.captureException,
  withScope: (callback: (scope: unknown) => void) => callback(mocks),
}));

vi.mock("@pungdung/worker-socket-bridge/react", () => {
  const manager = {
    getRuntimeMode: () => "dedicated",
    getSnapshot: () => ({ connection: mocks.state }),
    storeSubscribe: (listener: () => void) => {
      mocks.listeners.add(listener);
      return () => mocks.listeners.delete(listener);
    },
  };
  return { useSocketManager: () => manager };
});

import { useReportSocketRecoveryFailure } from "./useReportSocketRecoveryFailure";

describe("useReportSocketRecoveryFailure", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.listeners.clear();
    mocks.state.phase = "connecting";
    mocks.state.error = undefined;
  });

  it("reports each failure transition with runtime and device context", () => {
    const { unmount } = renderHook(() => useReportSocketRecoveryFailure());
    expect(mocks.captureException).not.toHaveBeenCalled();

    act(() => {
      mocks.state.phase = "failed";
      mocks.state.error = "worker-recovery-timeout";
      mocks.listeners.forEach((listener) => listener());
      mocks.listeners.forEach((listener) => listener());
      mocks.state.phase = "connected";
      mocks.state.error = undefined;
      mocks.listeners.forEach((listener) => listener());
    });

    expect(mocks.captureException).toHaveBeenCalledTimes(1);
    expect(mocks.setTag).toHaveBeenCalledWith("socket_runtime_current", "dedicated");
    expect(mocks.setTag).toHaveBeenCalledWith("report_class", "failure");
    expect(mocks.setFingerprint).toHaveBeenCalledWith(["socket", "worker-recovery-failed"]);
    expect(mocks.setExtras).toHaveBeenCalledWith(expect.objectContaining({ display_mode: "browser" }));

    act(() => {
      mocks.state.phase = "failed";
      mocks.state.error = "worker-recovery-timeout";
      mocks.listeners.forEach((listener) => listener());
    });
    expect(mocks.captureException).toHaveBeenCalledTimes(2);
    unmount();
    expect(mocks.listeners.size).toBe(0);
  });
});
