import { afterEach, describe, expect, it, vi } from "vitest";

import { createSocketRecoveryRunner } from "./socket-recovery-runner";

const deadWorker = {
  healthy: false,
  workerAlive: false,
  stompConnected: false,
  webSocketOpen: false,
  webSocketReadyState: null,
  serverActivityStale: false,
  clientConnected: false,
};

describe("worker recovery timeout", () => {
  afterEach(() => vi.useRealTimers());

  it("reports failure after 10 seconds and does not report it twice", async () => {
    vi.useFakeTimers();
    let finish!: () => void;
    const reconnect = vi.fn(() => new Promise<void>((resolve) => { finish = resolve; }));
    const failure = vi.fn();
    const run = createSocketRecoveryRunner(reconnect, vi.fn(), vi.fn(), async () => ({ url: "https://example.com" }), 0, () => 0, vi.fn(), failure);
    const task = run({ trigger: "foreground" }, deadWorker);
    await vi.advanceTimersByTimeAsync(9_999);
    expect(failure).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(failure).toHaveBeenCalledTimes(1);
    finish();
    await task;
    expect(failure).toHaveBeenCalledTimes(1);
  });

  it("does not report failure after disposal", async () => {
    vi.useFakeTimers();
    let finish!: () => void;
    const reconnect = vi.fn(() => new Promise<void>((resolve) => { finish = resolve; }));
    const failure = vi.fn();
    const run = createSocketRecoveryRunner(reconnect, vi.fn(), vi.fn(), async () => ({ url: "https://example.com" }), 0, () => 0, vi.fn(), failure);
    const task = run({ trigger: "foreground" }, deadWorker);
    await vi.advanceTimersByTimeAsync(0);
    run.dispose();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(failure).not.toHaveBeenCalled();
    finish();
    await task;
  });
  it("reports configuration failure without waiting for a connection", async () => {
    const failure = vi.fn();
    const run = createSocketRecoveryRunner(vi.fn(), vi.fn(), vi.fn(), async () => { throw new Error("token unavailable"); }, 0, () => 0, vi.fn(), failure);
    await expect(run({ trigger: "foreground" }, deadWorker)).rejects.toThrow("token unavailable");
    expect(failure).toHaveBeenCalledOnce();
  });

  it("reports failure when configuration retrieval remains pending", async () => {
    vi.useFakeTimers();
    const failure = vi.fn();
    const run = createSocketRecoveryRunner(vi.fn(), vi.fn(), vi.fn(), () => new Promise(() => {}), 0, () => 0, vi.fn(), failure);
    void run({ trigger: "foreground" }, deadWorker);
    await vi.advanceTimersByTimeAsync(10_000);
    expect(failure).toHaveBeenCalledOnce();
    run.dispose();
  });

});
