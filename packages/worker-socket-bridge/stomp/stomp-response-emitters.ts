import type {
  ConnectionPhase,
  PongPayload,
  PublishStatus,
  ResponseEnvelope,
  SubscriptionStatus,
} from "../src/protocol";

import {
  formatWorkerError,
  withOptionalCommandId,
} from "./message-envelope-utils";

type RetryingCommandType = "SUBSCRIBE" | "SEND_MESSAGE" | "CONNECT";

export function buildConnectionState(
  phase: ConnectionPhase,
  isConnected: boolean,
  error?: string
): ResponseEnvelope {
  return {
    type: "CONNECTION_STATE",
    data: {
      phase,
      isConnected,
      ...(error ? { error } : {}),
    },
  };
}

export function buildSubscriptionState(
  topic: string,
  status: SubscriptionStatus,
  commandId: string | null,
  error?: string
): ResponseEnvelope {
  return withOptionalCommandId(
    {
      type: "SUBSCRIPTION_STATE",
      data: {
        topic,
        status,
        ...(error ? { error } : {}),
      },
    },
    commandId
  );
}

export function buildSubscribed(
  topic: string,
  commandId: string | null
): ResponseEnvelope {
  return withOptionalCommandId(
    {
      type: "SUBSCRIBED",
      data: { topic },
    },
    commandId
  );
}

export function buildPublished(
  topic: string,
  commandId: string | null
): ResponseEnvelope {
  return buildPublishState(topic, "published", commandId);
}

export function buildPublishState(
  topic: string,
  status: PublishStatus,
  commandId: string | null,
  error?: string
): ResponseEnvelope {
  return withOptionalCommandId(
    {
      type: "PUBLISHED",
      data: {
        topic,
        status,
        ...(error ? { error } : {}),
      },
    },
    commandId
  );
}

export function buildRetrying(
  commandType: RetryingCommandType,
  topic: string | null,
  commandId: string | null,
  reason: string
): ResponseEnvelope {
  return withOptionalCommandId(
    {
      type: "RETRYING",
      data: {
        commandType,
        ...(topic ? { topic } : {}),
        ...(reason ? { reason } : {}),
      },
    },
    commandId
  );
}

export function buildCommandError(
  commandId: string | null,
  error: unknown
): ResponseEnvelope {
  return withOptionalCommandId(
    {
      type: "ERROR",
      error: formatWorkerError(error),
    },
    commandId
  );
}

export function buildMessage(topic: string, message: unknown): ResponseEnvelope {
  return {
    type: "MESSAGE",
    data: {
      topic,
      message,
    },
  };
}

export function buildConnected(commandId: string): ResponseEnvelope {
  return {
    type: "CONNECTED",
    commandId,
  };
}

export function buildPong(
  data: PongPayload,
  commandId: string | null
): ResponseEnvelope {
  return withOptionalCommandId(
    {
      type: "PONG",
      data,
    },
    commandId
  );
}
