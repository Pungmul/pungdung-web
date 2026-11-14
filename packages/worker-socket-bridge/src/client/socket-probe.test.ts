import { afterEach, describe, expect, it, vi } from "vitest";

import { SocketProbe } from "./socket-probe";

describe("foreground worker probe", () => {
  afterEach(() => vi.useRealTimers());

  it("accepts a pong after the first timeout", async () => {
    vi.useFakeTimers();
    const pong = { isStompConnected: true, isWebSocketOpen: true, isServerActivityStale: false };
    const probe = new SocketProbe({
      getRuntimeMode: () => "dedicated",
      hasRuntime: () => true,
      invokePingCommand: () => new Promise((resolve) => setTimeout(() => resolve(pong), 180)),
      getConnectionStatus: () => ({ phase: "connected", isConnected: true }),
      updateConnectionStatus: vi.fn(),
      getLastConnectConfig: () => null,
      getListenerTopicSize: () => 0,
      getMessageInactivityProbeMs: () => undefined,
    });
    const result = probe.checkConnectionState(undefined, [100, 200, 300]);
    await vi.advanceTimersByTimeAsync(180);
    expect((await result).healthy).toBe(true);
  });

  it("reports a dead worker only after all attempts time out", async () => {
    vi.useFakeTimers();
    const probe = new SocketProbe({
      getRuntimeMode: () => "dedicated",
      hasRuntime: () => true,
      invokePingCommand: () => new Promise(() => {}),
      getConnectionStatus: () => ({ phase: "connected", isConnected: true }),
      updateConnectionStatus: vi.fn(),
      getLastConnectConfig: () => null,
      getListenerTopicSize: () => 0,
      getMessageInactivityProbeMs: () => undefined,
    });
    const result = probe.checkConnectionState(undefined, [100, 200, 300]);
    let settled = false;
    void result.then(() => { settled = true; });
    await vi.advanceTimersByTimeAsync(299);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect((await result).workerAlive).toBe(false);
  });
});
