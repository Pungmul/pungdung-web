import type {
  CommandEnvelope,
  ConnectionPhase,
  ResponseEnvelope,
  ResponseType,
  SocketConfig,
  SubscriptionStatus,
} from "../../src/protocol";

export type {
  SocketConfig,
  CommandEnvelope as WorkerMessage,
  ResponseEnvelope as WorkerResponse,
};

export type WorkerOutboundMessage = ResponseEnvelope & {
  clientId?: number | string;
};

export interface TopicPayload {
  topic?: string;
  message?: unknown;
}

export interface QueuedSubscription {
  topic: string;
  commandId: string | null;
}

export interface QueuedPublish {
  topic: string;
  message: unknown;
  commandId: string | null;
}

export interface TopicSubscribeWaiter {
  clientId: number;
  commandId: string | null;
}

export interface TopicSubscriptionState {
  status: SubscriptionStatus;
  error?: string;
}

export type { ConnectionPhase, ResponseType };
