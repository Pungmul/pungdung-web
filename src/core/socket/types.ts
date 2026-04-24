export interface SocketConfig {
  url: string;
  headers?: Record<string, string>;
}

export interface Subscription {
  topic: string;
  id: string;
}

export type SocketConnectionPhase =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "failed"
  | "disconnected";

export type SocketConnectionStatus = {
  phase: SocketConnectionPhase;
  isConnected: boolean;
  error?: string;
};

export type SocketSubscriptionStatus =
  | "idle"
  | "pending"
  | "subscribed"
  | "error";

export type SocketPublishStatus = "pending" | "published" | "error";

export type WorkerMessageType =
  | "CONNECT"
  | "SUBSCRIBE"
  | "UNSUBSCRIBE"
  | "SEND_MESSAGE"
  | "DISCONNECT";

export type WorkerResponseType =
  | "CONNECTED"
  | "SUBSCRIBED"
  | "MESSAGE"
  | "ERROR"
  | "CONNECTION_STATE"
  | "SUBSCRIPTION_STATE"
  | "PUBLISHED"
  | "RETRYING";

export interface WorkerMessage {
  type: WorkerMessageType;
  data?: unknown;
  commandId?: string;
}

export interface WorkerConnectionStatePayload {
  phase: SocketConnectionPhase;
  isConnected: boolean;
  error?: string;
}

export interface WorkerSubscriptionStatePayload {
  topic: string;
  status: SocketSubscriptionStatus;
  error?: string;
}

export interface WorkerPublishedPayload {
  topic: string;
  status: SocketPublishStatus;
  message?: unknown;
  error?: string;
}

export interface WorkerRetryingPayload {
  commandType: "SUBSCRIBE" | "SEND_MESSAGE" | "CONNECT";
  topic?: string;
  reason?: string;
}

export interface WorkerResponse {
  type: WorkerResponseType;
  data?: unknown;
  error?: unknown;
  commandId?: string;
  clientId?: string;
}