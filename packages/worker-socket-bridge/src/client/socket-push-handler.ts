import {
  CONNECTION_FAILED_REASON,
  HEARTBEAT_LOST_REASON,
} from "../../stomp/constants";
import {
  createTransportRecoverySignal,
  isHeartbeatLostReason,
} from "../../stomp/stomp-liveness";
import type {
  ConnectionStatePayload,
  MessagePayload,
  ResponseEnvelope,
  SocketConnectionStatus,
  SubscriptionStatePayload,
} from "../protocol";

import type { SocketSubscriptions } from "./socket-subscriptions";

export class SocketPushHandler {
  constructor(
    private readonly deps: {
      subscriptions: SocketSubscriptions;
      getConnectionStatus: () => SocketConnectionStatus;
      updateConnectionStatus: (status: SocketConnectionStatus) => void;
      touchConnectedActivity: () => void;
      markProbeHealthyNow: () => void;
      invalidateTransportProbeCache: () => void;
      onTransportRecoveryRequired: (signal: {
        reason: string;
        forceRecreate: boolean;
      }) => void;
      onStateChanged: () => void;
    }
  ) {}

  handlePush(response: ResponseEnvelope): void {
    const { type, data, error } = response;

    switch (type) {
      case "CONNECTED":
        this.deps.updateConnectionStatus({
          phase: "connected",
          isConnected: true,
        });
        this.deps.touchConnectedActivity();
        break;
      case "CONNECTION_STATE":
        this.applyConnectionState(data);
        break;
      case "SUBSCRIBED":
        this.applySubscribedState(data);
        break;
      case "SUBSCRIPTION_STATE":
        this.applySubscriptionState(data as SubscriptionStatePayload);
        break;
      case "PUBLISHED":
        break;
      case "RETRYING":
        break;
      case "MESSAGE":
        this.dispatchMessage(data as MessagePayload);
        break;
      case "ERROR":
        if (!response.commandId) {
          this.deps.updateConnectionStatus({
            phase: "failed",
            isConnected: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
        break;
      default:
        break;
    }
  }

  applyConnectionState(data: unknown): void {
    const payload = data as ConnectionStatePayload;
    const isConnected = Boolean(payload.isConnected);
    this.deps.updateConnectionStatus({
      phase: payload.phase ?? "failed",
      isConnected,
      ...(payload.error ? { error: payload.error } : {}),
    });
    if (isConnected) {
      this.deps.touchConnectedActivity();
      this.deps.markProbeHealthyNow();
      return;
    }

    this.deps.invalidateTransportProbeCache();

    const recoveryReason = isHeartbeatLostReason(payload.error)
      ? HEARTBEAT_LOST_REASON
      : payload.phase === "failed"
        ? CONNECTION_FAILED_REASON
        : null;

    if (!recoveryReason) {
      return;
    }

    this.deps.onTransportRecoveryRequired(
      createTransportRecoverySignal(recoveryReason, true)
    );
  }

  applySubscribedState(data: unknown): void {
    const payload = data as { topic?: string };
    if (!payload?.topic) {
      return;
    }
    this.deps.subscriptions.markTopicSubscribed(payload.topic);
    this.deps.onStateChanged();
  }

  applySubscriptionState(data: SubscriptionStatePayload): void {
    if (!data?.topic) {
      return;
    }

    if (data.status === "subscribed") {
      this.deps.subscriptions.markTopicSubscribed(data.topic);
    } else if (data.status === "pending") {
      this.deps.subscriptions.markTopicPending(data.topic);
    } else if (data.status === "error") {
      this.deps.subscriptions.markTopicError(
        data.topic,
        data.error || "Subscription failed"
      );
    }

    this.deps.onStateChanged();
  }

  dispatchMessage(data: MessagePayload): void {
    this.deps.subscriptions.dispatchMessage(data);
  }
}
