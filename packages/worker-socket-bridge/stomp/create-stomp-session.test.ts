import { beforeEach, describe, expect, it, vi } from "vitest";

const mockState = vi.hoisted(() => ({
  sockJsCtor: vi.fn(),
  sockJsInstances: [] as Array<{ readyState: number }>,
  clientInstances: [] as Array<{
    connected: boolean;
    activate: ReturnType<typeof vi.fn>;
    deactivate: ReturnType<typeof vi.fn>;
    subscribe: ReturnType<typeof vi.fn>;
    publish: ReturnType<typeof vi.fn>;
    options: Record<string, unknown>;
  }>,
}));

vi.mock("sockjs-client", () => {
  function MockSockJS(url: string, _ignored?: unknown, options?: unknown) {
    mockState.sockJsCtor(url, options);
    const socket = { readyState: 0 };
    mockState.sockJsInstances.push(socket);
    return socket;
  }
  return { default: MockSockJS };
});

vi.mock("@stomp/stompjs", () => {
  class MockClient {
    connected = false;
    options: Record<string, unknown>;
    activate = vi.fn();
    deactivate = vi.fn();
    subscribe = vi.fn(() => ({ unsubscribe: vi.fn() }));
    publish = vi.fn();

    constructor(options: Record<string, unknown>) {
      this.options = options;
      mockState.clientInstances.push(this);
    }
  }

  return { Client: MockClient };
});

import { SOCKET_NOT_CONNECTED_REASON } from "./constants";
import { createStompSession } from "./create-stomp-session";

describe("create-stomp-session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.clientInstances.length = 0;
    mockState.sockJsInstances.length = 0;
  });

  it("should route CONNECT/SUBSCRIBE/DISCONNECT commands", () => {
    const emit = vi.fn();
    const session = createStompSession(emit);

    session.handleCommand({
      type: "CONNECT",
      commandId: "cmd-connect",
      data: {
        url: "https://socket.example/ws",
      },
    });

    expect(mockState.sockJsCtor).toHaveBeenCalledWith(
      "https://socket.example/ws",
      undefined
    );
    expect(mockState.clientInstances).toHaveLength(1);

    const client = mockState.clientInstances[0];
    expect(client.activate).toHaveBeenCalledTimes(1);

    client.connected = true;
    session.handleCommand({
      type: "SUBSCRIBE",
      commandId: "cmd-subscribe",
      data: { topic: "/topic/a" },
    });

    expect(client.subscribe).toHaveBeenCalledWith("/topic/a", expect.any(Function));

    session.handleCommand({ type: "DISCONNECT" });
    expect(client.deactivate).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith({
      type: "CONNECTION_STATE",
      data: {
        phase: "disconnected",
        isConnected: false,
      },
    });
  });

  it("should set failed phase when onWebSocketError fires", () => {
    const emit = vi.fn();
    const session = createStompSession(emit);

    session.handleCommand({
      type: "CONNECT",
      commandId: "cmd-connect",
      data: {
        url: "https://socket.example/ws",
      },
    });

    const client = mockState.clientInstances[0];
    const onWebSocketError = client.options.onWebSocketError as
      | ((error: unknown) => void)
      | undefined;

    expect(onWebSocketError).toBeTypeOf("function");
    onWebSocketError?.("ws-failed");

    expect(emit).toHaveBeenCalledWith({
      type: "CONNECTION_STATE",
      data: {
        phase: "failed",
        isConnected: false,
        error: "ws-failed",
      },
    });
  });

  it("should expose transport and stomp flags from getConnectionProbe", () => {
    const session = createStompSession(vi.fn());

    expect(session.getConnectionProbe()).toEqual({
      isStompConnected: false,
      phase: "idle",
      isWebSocketOpen: false,
      webSocketReadyState: null,
      lastServerActivityAt: null,
      serverActivityStaleThresholdMs: 20_000,
      isServerActivityStale: false,
    });

    session.handleCommand({
      type: "CONNECT",
      commandId: "cmd-connect",
      data: {
        url: "https://socket.example/ws",
      },
    });

    const transportSocket = mockState.sockJsInstances[0];
    transportSocket.readyState = 1;
    const client = mockState.clientInstances[0];
    client.connected = true;

    expect(session.getConnectionProbe()).toEqual({
      isStompConnected: true,
      phase: "connecting",
      isWebSocketOpen: true,
      webSocketReadyState: 1,
      lastServerActivityAt: null,
      serverActivityStaleThresholdMs: 20_000,
      isServerActivityStale: false,
    });
  });

  it("should emit failed connection state when heartbeat is lost", () => {
    const emit = vi.fn();
    const session = createStompSession(emit);

    session.handleCommand({
      type: "CONNECT",
      commandId: "cmd-connect",
      data: {
        url: "https://socket.example/ws",
      },
    });

    const client = mockState.clientInstances[0];
    const onHeartbeatLost = client.options.onHeartbeatLost as
      | (() => void)
      | undefined;

    expect(onHeartbeatLost).toBeTypeOf("function");
    onHeartbeatLost?.();

    expect(emit).toHaveBeenCalledWith({
      type: "CONNECTION_STATE",
      data: {
        phase: "failed",
        isConnected: false,
        error: "heartbeat-lost",
      },
    });
  });

  it("should emit RETRYING for pending subscribe when socket is not connected", () => {
    const emit = vi.fn();
    const session = createStompSession(emit);

    session.handleCommand({
      type: "SUBSCRIBE",
      commandId: "cmd-subscribe",
      data: { topic: "/topic/retry" },
    });

    expect(emit).toHaveBeenCalledWith({
      type: "SUBSCRIPTION_STATE",
      commandId: "cmd-subscribe",
      data: {
        topic: "/topic/retry",
        status: "pending",
      },
    });
    expect(emit).toHaveBeenCalledWith({
      type: "RETRYING",
      commandId: "cmd-subscribe",
      data: {
        commandType: "SUBSCRIBE",
        topic: "/topic/retry",
        reason: SOCKET_NOT_CONNECTED_REASON,
      },
    });
  });
});
