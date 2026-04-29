import type { SocketStompConfig } from "../src/protocol";

import { HEARTBEAT_LOST_REASON } from "./constants";

export { HEARTBEAT_LOST_REASON };

export const DEFAULT_HEARTBEAT_TOLERANCE_MULTIPLIER = 2;

export type TransportRecoverySignal = {
  reason: string;
  forceRecreate: boolean;
};

export function createTransportRecoverySignal(
  reason: string,
  forceRecreate = true
): TransportRecoverySignal {
  return { reason, forceRecreate };
}

export function readTransportRecoverySignal(
  error: unknown
): TransportRecoverySignal | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  if (!("reason" in error) || typeof error.reason !== "string") {
    return null;
  }

  return {
    reason: error.reason,
    forceRecreate:
      "forceRecreate" in error ? Boolean(error.forceRecreate) : true,
  };
}

export function isHeartbeatLostReason(reason: string | undefined): boolean {
  return reason === HEARTBEAT_LOST_REASON;
}

/** `HEARTBEAT_LOST_REASON` 판정과 동일한 stale ms. foreground background recreate 임계값 */
export const HEARTBEAT_LOST_RECREATE_THRESHOLD_MS =
  resolveHeartbeatStaleThresholdMs();

export function resolveHeartbeatStaleThresholdMs(
  stompConfig?: SocketStompConfig,
  toleranceMultiplier: number = DEFAULT_HEARTBEAT_TOLERANCE_MULTIPLIER
): number {
  const incoming = stompConfig?.heartbeatIncoming ?? 10_000;
  const outgoing = stompConfig?.heartbeatOutgoing ?? 10_000;

  if (incoming === 0 && outgoing === 0) {
    return 0;
  }

  return Math.max(incoming, outgoing) * toleranceMultiplier;
}

export type StompLivenessTracker = {
  getLastServerActivityAt: () => number | null;
  getHeartbeatStaleThresholdMs: () => number;
  setHeartbeatStaleThresholdMs: (thresholdMs: number) => void;
  touchServerActivity: () => void;
  resetServerActivity: () => void;
  isServerActivityStale: (isConnected: boolean) => boolean;
};

export function createStompLivenessTracker(
  initialThresholdMs: number = resolveHeartbeatStaleThresholdMs()
): StompLivenessTracker {
  let lastServerActivityAt: number | null = null;
  let heartbeatStaleThresholdMs = initialThresholdMs;

  return {
    getLastServerActivityAt: () => lastServerActivityAt,
    getHeartbeatStaleThresholdMs: () => heartbeatStaleThresholdMs,
    setHeartbeatStaleThresholdMs: (thresholdMs: number) => {
      heartbeatStaleThresholdMs = thresholdMs;
    },
    touchServerActivity: () => {
      lastServerActivityAt = Date.now();
    },
    resetServerActivity: () => {
      lastServerActivityAt = null;
    },
    isServerActivityStale: (isConnected: boolean) => {
      if (
        !isConnected ||
        heartbeatStaleThresholdMs <= 0 ||
        lastServerActivityAt === null
      ) {
        return false;
      }

      return Date.now() - lastServerActivityAt > heartbeatStaleThresholdMs;
    },
  };
}
