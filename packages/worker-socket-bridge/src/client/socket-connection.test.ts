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
  it("replaces a worker even while CONNECT is pending", async () => {
    type Deps = ConstructorParameters<typeof SocketConnectionLifecycle>[0];
    const firstRuntime = createRuntimeStub("dedicated");
    const secondRuntime = createRuntimeStub("dedicated");
    vi.mocked(createSocketRuntimeWithFallback)
      .mockReturnValueOnce(createControllerStub(firstRuntime) as unknown as ReturnType<typeof createSocketRuntimeWithFallback>)
      .mockReturnValueOnce(createControllerStub(secondRuntime) as unknown as ReturnType<typeof createSocketRuntimeWithFallback>);
    let finishFirst!: () => void;
    const invokeCommand = vi.fn<Deps["invokeCommand"]>()
      .mockImplementationOnce(() => new Promise((resolve) => { finishFirst = () => resolve(undefined); }))
      .mockResolvedValue(undefined);
    const lifecycle = new SocketConnectionLifecycle({
      managerOptions: {}, invokeCommand,
      postDisconnect: vi.fn(), rejectAllPendingRpc: vi.fn(), getPendingRpcSize: () => 0,
      getConnectionStatus: () => ({ phase: "connecting", isConnected: false }),
      setConnectionStatusSilently: vi.fn(), updateConnectionStatus: vi.fn(),
      subscriptions: { getActiveTopics: () => [], markTopicPending: vi.fn(), flushMessageBuffer: vi.fn() } as unknown as Deps["subscriptions"],
      probe: { resetActivity: vi.fn(), invalidateTransportProbeCache: vi.fn(), markProbeHealthyNow: vi.fn() } as unknown as Deps["probe"],
      topicBufferClear: vi.fn(), onStateChanged: vi.fn(), onRuntimeReady: vi.fn(),
    });
    const config = { url: "https://example.com" };
    const first = lifecycle.connect(config);
    const firstResult = expect(first).rejects.toThrow("Socket runtime replaced");
    await lifecycle.forceRecreateRuntime(config);
    expect(firstRuntime.dispose).toHaveBeenCalledOnce();
    finishFirst();
    await firstResult;
    expect(lifecycle.getRuntime()).toBe(secondRuntime);
  });

  it.each(["connect", "ensureConnected", "forceReconnect"] as const)("keeps %s when a previous disconnect finishes late", async (method) => {
    type Deps = ConstructorParameters<typeof SocketConnectionLifecycle>[0];
    const firstRuntime = createRuntimeStub("dedicated");
    const secondRuntime = createRuntimeStub("dedicated");
    vi.mocked(createSocketRuntimeWithFallback)
      .mockReturnValueOnce(createControllerStub(firstRuntime) as unknown as ReturnType<typeof createSocketRuntimeWithFallback>)
      .mockReturnValueOnce(createControllerStub(secondRuntime) as unknown as ReturnType<typeof createSocketRuntimeWithFallback>);
    let finishDisconnect!: () => void;
    const lifecycle = new SocketConnectionLifecycle({
      managerOptions: {}, invokeCommand: vi.fn().mockResolvedValue(undefined),
      postDisconnect: () => new Promise((resolve) => { finishDisconnect = resolve; }),
      rejectAllPendingRpc: vi.fn(), getPendingRpcSize: () => 0,
      getConnectionStatus: () => ({ phase: "disconnected", isConnected: false }),
      setConnectionStatusSilently: vi.fn(), updateConnectionStatus: vi.fn(),
      subscriptions: { getActiveTopics: () => [], markTopicPending: vi.fn(), flushMessageBuffer: vi.fn() } as unknown as Deps["subscriptions"],
      probe: { resetActivity: vi.fn(), invalidateTransportProbeCache: vi.fn(), markProbeHealthyNow: vi.fn() } as unknown as Deps["probe"],
      topicBufferClear: vi.fn(), onStateChanged: vi.fn(), onRuntimeReady: vi.fn(),
    });
    const config = { url: "https://example.com" };
    await lifecycle.connect(config);
    const disconnect = lifecycle.disconnect();
    await lifecycle[method](config);
    finishDisconnect();
    await disconnect;
    expect(lifecycle.getRuntime()).toBe(secondRuntime);
    expect(secondRuntime.dispose).not.toHaveBeenCalled();
  });

});
