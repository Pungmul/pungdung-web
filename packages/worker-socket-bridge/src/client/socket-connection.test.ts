import { describe, expect, it, vi } from "vitest";

import type { SocketConfig, SocketConnectionStatus } from "../protocol";
import type { SocketRuntime } from "../runtime";
import { createSocketRuntimeWithFallback } from "../runtime";
import { SocketConnectionLifecycle } from "./socket-connection";

vi.mock("../runtime", async () => {
  const actual = await vi.importActual("../runtime");
  return {
    ...actual,
    createSocketRuntimeWithFallback: vi.fn(),
  };
});

function createRuntimeStub(mode: SocketRuntime["mode"] = "main-thread"): SocketRuntime {
  return {
    mode,
    dispatch: vi.fn(() => ({ cancelled: [] })),
    setMessageHandler: vi.fn(),
    dispose: vi.fn(),
  };
}

function createControllerStub(runtime: SocketRuntime) {
  let fallbackCallCount = 0;
  return {
    runtime,
    tryNextRuntime: vi.fn(() => {
      fallbackCallCount += 1;
      if (fallbackCallCount >= 3) {
        return null;
      }
      return createRuntimeStub("main-thread");
    }),
  };
}

describe("SocketConnectionLifecycle", () => {
  it("connect 실패를 호출자에게 reject로 전파하고 이후 재시도가 가능하다", async () => {
    type LifecycleDeps = ConstructorParameters<typeof SocketConnectionLifecycle>[0];
    const mockedCreateRuntimeWithFallback = vi.mocked(createSocketRuntimeWithFallback);
    mockedCreateRuntimeWithFallback.mockImplementation(
      () =>
        createControllerStub(createRuntimeStub("main-thread")) as unknown as ReturnType<
          typeof createSocketRuntimeWithFallback
        >
    );

    let connectionStatus: SocketConnectionStatus = {
      phase: "idle",
      isConnected: false,
    };
    let connectFailuresRemaining = 3;
    const invokeCommand = vi.fn<LifecycleDeps["invokeCommand"]>(
      async (command: "CONNECT" | "SUBSCRIBE", _payload: SocketConfig | { topic: string }) => {
        if (command === "CONNECT" && connectFailuresRemaining > 0) {
          connectFailuresRemaining -= 1;
          throw new Error("connect failed");
        }
        return undefined;
      }
    );

    const lifecycle = new SocketConnectionLifecycle({
      managerOptions: {},
      invokeCommand,
      postDisconnect: vi.fn(),
      rejectAllPendingRpc: vi.fn(),
      getPendingRpcSize: () => 0,
      getConnectionStatus: () => connectionStatus,
      setConnectionStatusSilently: (status) => {
        connectionStatus = status;
      },
      updateConnectionStatus: (status) => {
        connectionStatus = status;
      },
      subscriptions: {
        getActiveTopics: () => [],
        markTopicPending: vi.fn(),
        flushMessageBuffer: vi.fn(),
        getListenerTopicSize: () => 0,
        clearAll: vi.fn(),
      } as unknown as LifecycleDeps["subscriptions"],
      probe: {
        probeConnectionAlive: vi.fn().mockResolvedValue(false),
        markProbeHealthyNow: vi.fn(),
        resetActivity: vi.fn(),
        invalidateTransportProbeCache: vi.fn(),
      } as unknown as LifecycleDeps["probe"],
      topicBufferClear: vi.fn(),
      onStateChanged: vi.fn(),
      onRuntimeReady: vi.fn(),
    });

    await expect(
      lifecycle.connect(
        { url: "ws://localhost:8080", headers: {} },
        { skipConnectedProbe: true }
      )
    ).rejects.toThrow("connect failed");

    await expect(
      lifecycle.connect(
        { url: "ws://localhost:8080", headers: {} },
        { skipConnectedProbe: true }
      )
    ).resolves.toBeUndefined();
  });
});
