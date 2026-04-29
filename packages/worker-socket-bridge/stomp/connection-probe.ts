import type { Client } from "@stomp/stompjs";

import type { ConnectionPhase, PongPayload } from "../src/protocol";

import type { StompLivenessTracker } from "./stomp-liveness";

export const WEB_SOCKET_READY_STATE = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
} as const;

type TransportSocket = {
  readyState?: number;
};

function resolveTransportReadyState(
  stompClient: Client | null,
  transportSocket: TransportSocket | null
): number | null {
  if (
    transportSocket !== null &&
    typeof transportSocket.readyState === "number"
  ) {
    return transportSocket.readyState;
  }

  const stompTransport = stompClient?.webSocket as TransportSocket | undefined;
  if (stompTransport && typeof stompTransport.readyState === "number") {
    return stompTransport.readyState;
  }

  return null;
}

export function buildStompConnectionProbe(
  stompClient: Client | null,
  connectionPhase: ConnectionPhase,
  transportSocket: TransportSocket | null = null,
  liveness?: StompLivenessTracker | null
): PongPayload {
  const webSocketReadyState = resolveTransportReadyState(
    stompClient,
    transportSocket
  );
  const isWebSocketOpen =
    webSocketReadyState === WEB_SOCKET_READY_STATE.OPEN;
  const isStompConnected = Boolean(stompClient?.connected);
  const isServerActivityStale =
    liveness?.isServerActivityStale(isStompConnected) ?? false;

  return {
    isStompConnected,
    phase: connectionPhase,
    isWebSocketOpen,
    webSocketReadyState,
    lastServerActivityAt: liveness?.getLastServerActivityAt() ?? null,
    serverActivityStaleThresholdMs:
      liveness?.getHeartbeatStaleThresholdMs() ?? null,
    isServerActivityStale,
  };
}

/** STOMP session flag, transport readyState, server activity를 함께 본다. */
export function isRuntimeTransportHealthy(pong: PongPayload): boolean {
  return (
    pong.isStompConnected &&
    pong.isWebSocketOpen &&
    !pong.isServerActivityStale
  );
}
