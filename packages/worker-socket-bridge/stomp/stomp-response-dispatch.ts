import type { ResponseEnvelope, SubscriptionStatus } from "../src/protocol";

import {
  buildCommandError,
  buildConnected,
  buildConnectionState,
  buildPublished,
  buildPublishState,
  buildRetrying,
  buildSubscribed,
  buildSubscriptionState,
} from "./stomp-response-emitters";

type RetryingCommandType = "SUBSCRIBE" | "SEND_MESSAGE" | "CONNECT";
type PublishStatus = "pending" | "published" | "error";

export function createSessionResponseDispatch(
  emit: (message: ResponseEnvelope) => void
) {
  return {
    connectionState(
      phase: Parameters<typeof buildConnectionState>[0],
      isConnected: boolean,
      error?: string
    ) {
      emit(buildConnectionState(phase, isConnected, error));
    },
    subscriptionState(
      topic: string,
      status: SubscriptionStatus,
      commandId: string | null,
      error?: string
    ) {
      emit(buildSubscriptionState(topic, status, commandId, error));
    },
    publishState(
      topic: string,
      status: PublishStatus,
      commandId: string | null,
      error?: string
    ) {
      emit(buildPublishState(topic, status, commandId, error));
    },
    subscribed(topic: string, commandId: string | null) {
      emit(buildSubscribed(topic, commandId));
      emit(buildSubscriptionState(topic, "subscribed", commandId));
    },
    published(topic: string, commandId: string | null) {
      emit(buildPublished(topic, commandId));
    },
    retrying(
      commandType: RetryingCommandType,
      topic: string | null,
      commandId: string | null,
      reason: string
    ) {
      emit(buildRetrying(commandType, topic, commandId, reason));
    },
    commandError(commandId: string | null, error: unknown) {
      emit(buildCommandError(commandId, error));
    },
    connected(commandId: string) {
      emit(buildConnected(commandId));
    },
  };
}

type WorkerOutboundMessage = ResponseEnvelope & {
  clientId?: number | string;
};

export function createHubClientResponseDispatch(
  sendToClient: (clientId: number, message: WorkerOutboundMessage) => void
) {
  return {
    connectionState(
      clientId: number,
      phase: Parameters<typeof buildConnectionState>[0],
      isConnected: boolean,
      error?: string
    ) {
      sendToClient(clientId, buildConnectionState(phase, isConnected, error));
    },
    subscriptionState(
      clientId: number,
      topic: string,
      status: SubscriptionStatus,
      commandId: string | null,
      error?: string
    ) {
      sendToClient(
        clientId,
        buildSubscriptionState(topic, status, commandId, error)
      );
    },
    subscribed(clientId: number, topic: string, commandId: string | null) {
      sendToClient(clientId, buildSubscribed(topic, commandId));
      sendToClient(
        clientId,
        buildSubscriptionState(topic, "subscribed", commandId)
      );
    },
    published(clientId: number, topic: string, commandId: string | null) {
      sendToClient(clientId, buildPublished(topic, commandId));
    },
    retrying(
      clientId: number,
      commandType: RetryingCommandType,
      topic: string | null,
      commandId: string | null,
      reason: string
    ) {
      sendToClient(
        clientId,
        buildRetrying(commandType, topic, commandId, reason)
      );
    },
    commandError(
      clientId: number,
      commandId: string | null,
      error: unknown
    ) {
      sendToClient(clientId, buildCommandError(commandId, error));
    },
    connected(clientId: number, commandId: string) {
      sendToClient(clientId, { ...buildConnected(commandId), clientId });
    },
    publishState(
      clientId: number,
      topic: string,
      status: PublishStatus,
      commandId: string | null,
      error?: string
    ) {
      sendToClient(
        clientId,
        buildPublishState(topic, status, commandId, error)
      );
    },
  };
}
