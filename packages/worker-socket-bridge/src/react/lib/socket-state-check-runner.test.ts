import { describe, expect, it, vi } from "vitest";

import type { SocketConnectionStateCheck } from "../../client/socket-manager";

import type { StateCheckOptions } from "./socket-recovery-policy";
import { createSocketStateCheckRunner } from "./socket-state-check-runner";

const healthyState: SocketConnectionStateCheck = {
  healthy: true,
  workerAlive: true,
  stompConnected: true,
  webSocketOpen: true,
  webSocketReadyState: 1,
  serverActivityStale: false,
  clientConnected: true,
};

const stompUnhealthyState: SocketConnectionStateCheck = {
  healthy: false,
  workerAlive: true,
  stompConnected: false,
  webSocketOpen: false,
  webSocketReadyState: 3,
  serverActivityStale: false,
  clientConnected: false,
};

const heartbeatStaleState: SocketConnectionStateCheck = {
  healthy: false,
  workerAlive: true,
  stompConnected: true,
  webSocketOpen: true,
  webSocketReadyState: 1,
  serverActivityStale: true,
  clientConnected: true,
};

const workerDeadState: SocketConnectionStateCheck = {
  healthy: false,
  workerAlive: false,
  stompConnected: false,
  webSocketOpen: false,
  webSocketReadyState: null,
  serverActivityStale: false,
  clientConnected: false,
};

type RunRecoveryFn = (
  checkOptions: StateCheckOptions,
  state: SocketConnectionStateCheck
) => Promise<void>;

function createRunner(overrides?: {
  checkConnectionState?: () => Promise<SocketConnectionStateCheck>;
  runRecovery?: RunRecoveryFn;
  isStateCheckInFlight?: () => boolean;
}) {
  const checkConnectionState =
    overrides?.checkConnectionState ?? vi.fn().mockResolvedValue(healthyState);
  const runRecovery: RunRecoveryFn =
    overrides?.runRecovery ??
    vi.fn<RunRecoveryFn>().mockResolvedValue(undefined);

  let inFlight = false;
  const runStateCheck = createSocketStateCheckRunner(
    checkConnectionState,
    3_000,
    () => 0,
    vi.fn(),
    overrides?.isStateCheckInFlight ?? (() => inFlight),
    (value) => {
      inFlight = value;
    },
    runRecovery
  );

  return { runStateCheck, checkConnectionState, runRecovery };
}

describe("createSocketStateCheckRunner", () => {
  it("foreground 복귀 시 ping만 보고 healthy면 recovery를 호출하지 않는다", async () => {
    const { runStateCheck, checkConnectionState, runRecovery } = createRunner();

    runStateCheck({
      trigger: "foreground",
      force: true,
    });

    await vi.waitFor(() => {
      expect(checkConnectionState).toHaveBeenCalledTimes(1);
    });

    expect(runRecovery).not.toHaveBeenCalled();
  });

  it("heartbeat stale이면 forceRecreate로 recovery를 호출한다", async () => {
    const checkConnectionState = vi.fn().mockResolvedValue(heartbeatStaleState);
    const runRecovery = vi.fn().mockResolvedValue(undefined);
    const { runStateCheck } = createRunner({
      checkConnectionState,
      runRecovery,
    });

    runStateCheck({
      trigger: "foreground",
      force: true,
    });

    await vi.waitFor(() => {
      expect(runRecovery).toHaveBeenCalledWith(
        expect.objectContaining({ forceRecreate: true }),
        heartbeatStaleState
      );
    });
  });

  it("stomp만 끊기고 heartbeat는 살아 있으면 forceReconnect로 recovery를 호출한다", async () => {
    const checkConnectionState = vi.fn().mockResolvedValue(stompUnhealthyState);
    const runRecovery = vi.fn().mockResolvedValue(undefined);
    const { runStateCheck } = createRunner({
      checkConnectionState,
      runRecovery,
    });

    runStateCheck({
      trigger: "foreground",
      force: true,
    });

    await vi.waitFor(() => {
      expect(runRecovery).toHaveBeenCalledWith(
        expect.objectContaining({ forceRecreate: false }),
        stompUnhealthyState
      );
    });
  });

  it("ping 실패(worker dead)면 forceRecreate로 recovery를 호출한다", async () => {
    const checkConnectionState = vi.fn().mockResolvedValue(workerDeadState);
    const runRecovery = vi.fn().mockResolvedValue(undefined);
    const { runStateCheck } = createRunner({
      checkConnectionState,
      runRecovery,
    });

    runStateCheck({
      trigger: "foreground",
      force: true,
    });

    await vi.waitFor(() => {
      expect(runRecovery).toHaveBeenCalledWith(
        expect.objectContaining({ forceRecreate: true }),
        workerDeadState
      );
    });
  });

  it("foreground + force면 진행 중인 state check가 있어도 ping을 호출한다", async () => {
    const checkConnectionState = vi.fn().mockResolvedValue(healthyState);
    const { runStateCheck } = createRunner({
      checkConnectionState,
      isStateCheckInFlight: () => true,
    });

    runStateCheck({
      trigger: "foreground",
      force: true,
    });

    await vi.waitFor(() => {
      expect(checkConnectionState).toHaveBeenCalledTimes(1);
    });
  });
});
