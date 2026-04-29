import type { StompConfig, StompHeaders } from "@stomp/stompjs";
import type SockJS from "sockjs-client";

export type SocketSockJsOptions = ConstructorParameters<typeof SockJS>[2];

export type SocketStompConfig = Partial<
  Pick<
    StompConfig,
    | "connectionTimeout"
    | "heartbeatIncoming"
    | "heartbeatOutgoing"
    | "reconnectDelay"
  >
>;

export interface SocketConfig {
  url: string;
  headers?: StompHeaders;
  sockJsOptions?: SocketSockJsOptions;
  stomp?: SocketStompConfig;
}

export interface SocketListener {
  readonly topic: string;
  unsubscribe(): Promise<void>;
}

export type SocketConnectionStatus = {
  phase: ConnectionPhase;
  isConnected: boolean;
  error?: string;
};

/** Main → worker (or runtime) command envelope */
export type CommandType =
  | "CONNECT"
  | "PING"
  | "SUBSCRIBE"
  | "UNSUBSCRIBE"
  | "SEND_MESSAGE"
  | "DISCONNECT";

/** Worker (or runtime) → main response envelope */
export type ResponseType =
  | "CONNECTED"
  | "PONG"
  | "SUBSCRIBED"
  | "MESSAGE"
  | "ERROR"
  | "CONNECTION_STATE"
  | "SUBSCRIPTION_STATE"
  | "PUBLISHED"
  | "RETRYING";

/** Promise settle이 필요한 command */
export type RpcCommandType = Extract<
  CommandType,
  "CONNECT" | "PING" | "SUBSCRIBE" | "SEND_MESSAGE"
>;

/** fire-and-forget command */
export type PostCommandType = Extract<
  CommandType,
  "UNSUBSCRIBE" | "DISCONNECT"
>;

export interface CommandEnvelope {
  type: CommandType;
  data?: unknown;
  commandId?: string;
}

export interface ResponseEnvelope {
  type: ResponseType;
  data?: unknown;
  error?: unknown;
  commandId?: string;
  clientId?: string | number;
}

export type ConnectionPhase =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "failed"
  | "disconnected";

export interface ConnectionStatePayload {
  phase?: ConnectionPhase;
  isConnected?: boolean;
  error?: string;
}

export type SubscriptionStatus = "idle" | "pending" | "subscribed" | "error";

export interface SubscriptionStatePayload {
  topic: string;
  status: SubscriptionStatus;
  error?: string;
}

export type PublishStatus = "pending" | "published" | "error";

export interface PublishedPayload {
  topic: string;
  status: PublishStatus;
  message?: unknown;
  error?: string;
}

export interface MessagePayload {
  topic: string;
  message: unknown;
}

export interface SubscribedPayload {
  topic?: string;
}

/** PING 응답에 포함되는 런타임 연결 probe 결과 */
export interface PongPayload {
  /** STOMP CONNECTED frame 이후 client.connected 플래그 */
  isStompConnected: boolean;
  phase: ConnectionPhase;
  /** transport readyState === WebSocket.OPEN(1) */
  isWebSocketOpen: boolean;
  /** SockJS/WebSocket readyState. transport 미생성 시 null */
  webSocketReadyState: number | null;
  /** 마지막 서버 heartbeat 또는 MESSAGE 수신 시각(epoch ms) */
  lastServerActivityAt: number | null;
  /** heartbeat config 기반 stale 판정 임계(ms). 비활성 시 null */
  serverActivityStaleThresholdMs: number | null;
  /** 마지막 서버 활동이 임계를 넘겼는지 */
  isServerActivityStale: boolean;
}

export const RPC_COMMAND_TYPES = [
  "CONNECT",
  "PING",
  "SUBSCRIBE",
  "SEND_MESSAGE",
] as const satisfies readonly RpcCommandType[];

export const POST_COMMAND_TYPES = [
  "UNSUBSCRIBE",
  "DISCONNECT",
] as const satisfies readonly PostCommandType[];

export function isRpcCommandType(type: CommandType): type is RpcCommandType {
  return (RPC_COMMAND_TYPES as readonly CommandType[]).indexOf(type) !== -1;
}

export function isPostCommandType(type: CommandType): type is PostCommandType {
  return (POST_COMMAND_TYPES as readonly CommandType[]).indexOf(type) !== -1;
}
