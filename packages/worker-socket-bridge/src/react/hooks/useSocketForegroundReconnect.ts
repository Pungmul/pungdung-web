"use client";

import { useCallback, useEffect } from "react";

import type { SocketConfig } from "../../protocol";
import { createForegroundVisibilityTracker } from "../lib/foreground-visibility-tracker";
import { createSocketConnectionWatch } from "../lib/socket-connection-watch";
import {
  DEFAULT_CONNECTION_WATCH_INTERVAL_MS,
  DEFAULT_FOREGROUND_DEBOUNCE_MS,
  DEFAULT_MESSAGE_INACTIVITY_PROBE_MS,
  DEFAULT_RECOVERY_ACTION_COOLDOWN_MS,
  DEFAULT_STATE_CHECK_THROTTLE_MS,
  DEFAULT_TRANSPORT_FAILURE_DEBOUNCE_MS,
} from "../lib/socket-reconnect-config";
import { createSocketReconnectSession } from "../lib/socket-reconnect-session";
import { createTransportFailureRecoveryHandler } from "../lib/transport-failure-recovery-handler";
import { useSocketManager } from "../SocketManagerProvider";

import type { CreateSocketConnectConfig } from "./useInitSocketConnect";

type UseSocketForegroundReconnectOptions = {
  stateCheckThrottleMs?: number;
  recoveryActionCooldownMs?: number;
  connectionWatchIntervalMs?: number;
  messageInactivityProbeMs?: number;
  resolveConnectConfig?: () => Promise<SocketConfig>;
};

export function useSocketForegroundReconnect(
  accessToken: string | null | undefined,
  createConnectConfig: CreateSocketConnectConfig,
  options: UseSocketForegroundReconnectOptions = {}
) {
  const socket = useSocketManager();
  const stateCheckThrottleMs =
    options.stateCheckThrottleMs ?? DEFAULT_STATE_CHECK_THROTTLE_MS;
  const recoveryActionCooldownMs =
    options.recoveryActionCooldownMs ?? DEFAULT_RECOVERY_ACTION_COOLDOWN_MS;
  const connectionWatchIntervalMs =
    options.connectionWatchIntervalMs ?? DEFAULT_CONNECTION_WATCH_INTERVAL_MS;
  const messageInactivityProbeMs =
    options.messageInactivityProbeMs ?? DEFAULT_MESSAGE_INACTIVITY_PROBE_MS;
  const resolveConnectConfig = options.resolveConnectConfig;

  const resolveConfig = useCallback(async (): Promise<SocketConfig | null> => {
    if (resolveConnectConfig) {
      return resolveConnectConfig();
    }
    if (!accessToken) {
      return null;
    }
    return createConnectConfig(accessToken);
  }, [accessToken, createConnectConfig, resolveConnectConfig]);

  useEffect(() => {
    if (!accessToken && !resolveConnectConfig) {
      return;
    }

    const session = createSocketReconnectSession(
      (config) => socket.forceRecreateRuntime(config),
      () => socket.ensureWorkerAlive(),
      (config) => socket.forceReconnect(config),
      () => socket.checkConnectionState(),
      resolveConfig,
      recoveryActionCooldownMs,
      stateCheckThrottleMs
    );

    const transportFailureHandler = createTransportFailureRecoveryHandler(
      DEFAULT_TRANSPORT_FAILURE_DEBOUNCE_MS,
      session.runStateCheck
    );

    const visibilityTracker = createForegroundVisibilityTracker(
      DEFAULT_FOREGROUND_DEBOUNCE_MS,
      (trigger) => {
        if (trigger === "visibilitychange" && document.hidden) {
          return;
        }
        session.runStateCheck({
          trigger: "foreground",
          force: true,
        });
      }
    );

    const handleOnline = () => {
      session.runStateCheck({ trigger: "online", force: true });
    };

    socket.setTransportFailureHandler(
      transportFailureHandler.handleTransportFailure
    );
    window.addEventListener("online", handleOnline);

    const disposeWatch = createSocketConnectionWatch(
      (thresholdMs) => socket.shouldProbeForMessageInactivity(thresholdMs),
      messageInactivityProbeMs,
      connectionWatchIntervalMs,
      session.isStateCheckInFlight,
      session.runStateCheck
    );

    return () => {
      transportFailureHandler.dispose();
      visibilityTracker.dispose();
      socket.setTransportFailureHandler(null);
      window.removeEventListener("online", handleOnline);
      disposeWatch();
    };
  }, [
    accessToken,
    connectionWatchIntervalMs,
    messageInactivityProbeMs,
    recoveryActionCooldownMs,
    resolveConfig,
    resolveConnectConfig,
    socket,
    stateCheckThrottleMs,
  ]);
}
