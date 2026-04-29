import { describe, expect, it } from "vitest";

import {
  buildStompConnectionProbe,
  isRuntimeTransportHealthy,
  WEB_SOCKET_READY_STATE,
} from "./connection-probe";

describe("connection-probe", () => {
  it("should report transport and stomp flags from runtime state", () => {
    const transportSocket = { readyState: WEB_SOCKET_READY_STATE.OPEN };
    const stompClient = { connected: true, webSocket: transportSocket };

    expect(
      buildStompConnectionProbe(
        stompClient as never,
        "connected",
        transportSocket
      )
    ).toEqual({
      isStompConnected: true,
      phase: "connected",
      isWebSocketOpen: true,
      webSocketReadyState: WEB_SOCKET_READY_STATE.OPEN,
      lastServerActivityAt: null,
      serverActivityStaleThresholdMs: null,
      isServerActivityStale: false,
    });
  });

  it("should fall back to stomp client transport when socket ref is missing", () => {
    const stompClient = {
      connected: false,
      webSocket: { readyState: WEB_SOCKET_READY_STATE.CLOSED },
    };

    expect(buildStompConnectionProbe(stompClient as never, "reconnecting")).toEqual(
      {
        isStompConnected: false,
        phase: "reconnecting",
        isWebSocketOpen: false,
        webSocketReadyState: WEB_SOCKET_READY_STATE.CLOSED,
        lastServerActivityAt: null,
        serverActivityStaleThresholdMs: null,
        isServerActivityStale: false,
      }
    );
  });

  it("should return null readyState when transport is not created", () => {
    expect(buildStompConnectionProbe(null, "idle")).toEqual({
      isStompConnected: false,
      phase: "idle",
      isWebSocketOpen: false,
      webSocketReadyState: null,
      lastServerActivityAt: null,
      serverActivityStaleThresholdMs: null,
      isServerActivityStale: false,
    });
  });

  it("should require both stomp connected and websocket open for runtime health", () => {
    expect(
      isRuntimeTransportHealthy({
        isStompConnected: true,
        phase: "connected",
        isWebSocketOpen: true,
        webSocketReadyState: WEB_SOCKET_READY_STATE.OPEN,
        lastServerActivityAt: Date.now(),
        serverActivityStaleThresholdMs: 20_000,
        isServerActivityStale: false,
      })
    ).toBe(true);

    expect(
      isRuntimeTransportHealthy({
        isStompConnected: true,
        phase: "connected",
        isWebSocketOpen: false,
        webSocketReadyState: WEB_SOCKET_READY_STATE.CLOSING,
        lastServerActivityAt: Date.now(),
        serverActivityStaleThresholdMs: 20_000,
        isServerActivityStale: false,
      })
    ).toBe(false);

    expect(
      isRuntimeTransportHealthy({
        isStompConnected: true,
        phase: "connected",
        isWebSocketOpen: true,
        webSocketReadyState: WEB_SOCKET_READY_STATE.OPEN,
        lastServerActivityAt: Date.now() - 30_000,
        serverActivityStaleThresholdMs: 20_000,
        isServerActivityStale: true,
      })
    ).toBe(false);
  });
});
