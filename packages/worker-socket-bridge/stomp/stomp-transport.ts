import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import type { ConnectionPhase, SocketConfig } from "../src/protocol";

import { HEARTBEAT_LOST_REASON } from "./constants";
import {
  resolveHeartbeatStaleThresholdMs,
  type StompLivenessTracker,
} from "./stomp-liveness";

export type StompTransportRefs = {
  stompClient: Client | null;
  transportSocket: { readyState?: number } | null;
};

export type ActivateStompTransportOptions = {
  config: SocketConfig;
  liveness: StompLivenessTracker;
  getPhase: () => ConnectionPhase;
  setPhase: (phase: ConnectionPhase) => void;
  notifyConnectionState: (
    phase: ConnectionPhase,
    isConnected: boolean,
    error?: string
  ) => void;
  onConnected: () => void;
  onWebSocketReconnecting: () => void;
  rejectPendingConnect: (error: unknown) => void;
};

function disposeStompTransportRefs(refs: StompTransportRefs): void {
  if (refs.stompClient) {
    refs.stompClient.deactivate();
    refs.stompClient = null;
  }
  refs.transportSocket = null;
}

export function activateStompTransport(
  refs: StompTransportRefs,
  options: ActivateStompTransportOptions
): void {
  const {
    config,
    liveness,
    getPhase,
    setPhase,
    notifyConnectionState,
    onConnected,
    onWebSocketReconnecting,
    rejectPendingConnect,
  } = options;

  disposeStompTransportRefs(refs);

  const socket = new SockJS(config.url, undefined, config.sockJsOptions);
  refs.transportSocket = socket;
  liveness.setHeartbeatStaleThresholdMs(
    resolveHeartbeatStaleThresholdMs(config.stomp)
  );

  refs.stompClient = new Client({
    ...config.stomp,
    webSocketFactory: () => socket,
    connectHeaders: config.headers ?? {},
    onConnect: () => {
      liveness.touchServerActivity();
      setPhase("connected");
      notifyConnectionState("connected", true);
      onConnected();
    },
    onHeartbeatReceived: () => {
      liveness.touchServerActivity();
    },
    onHeartbeatLost: () => {
      setPhase("failed");
      notifyConnectionState("failed", false, HEARTBEAT_LOST_REASON);
    },
    onWebSocketClose: () => {
      const phase = getPhase();
      if (phase === "disconnected" || phase === "failed") {
        return;
      }
      setPhase("reconnecting");
      onWebSocketReconnecting();
      notifyConnectionState("reconnecting", false);
    },
    onStompError: (error) => {
      setPhase("failed");
      notifyConnectionState("failed", false, String(error));
      rejectPendingConnect(error);
    },
    onWebSocketError: (error) => {
      setPhase("failed");
      notifyConnectionState("failed", false, String(error));
      rejectPendingConnect(error);
    },
  });

  refs.stompClient.activate();
}
