import {
  SOCKET_BROKER_ERROR_NAME,
  SOCKET_CONTRACT_ERROR_NAME,
  type SocketBrokerError,
  type SocketContractError,
} from "./report-app-error.types";

// CONNECTION_STATE 복구 reason
// 브로커 ERROR 프레임 메시지와 다름
const SOCKET_RECONNECT_REASONS = new Set([
  "heartbeat-lost",
  "connection-reconnecting",
  "connection-failed",
  "socket-not-connected",
]);

export function isSocketReconnectReason(reason: string): boolean {
  return SOCKET_RECONNECT_REASONS.has(reason);
}

export function createSocketContractError(
  issues?: readonly { path: ReadonlyArray<PropertyKey>; code: string }[]
): SocketContractError {
  const error: SocketContractError = new Error(
    "소켓 응답 형식이 올바르지 않습니다."
  );
  error.name = SOCKET_CONTRACT_ERROR_NAME;
  if (issues && issues.length > 0) {
    error.zodIssues = issues.map((issue) => ({
      path: issue.path.map(String).join("."),
      code: issue.code,
    }));
  }
  return error;
}

export function createSocketBrokerError(reason?: string): SocketBrokerError {
  const error: SocketBrokerError = new Error(
    "소켓 브로커가 오류를 보냈습니다."
  );
  error.name = SOCKET_BROKER_ERROR_NAME;
  if (reason) {
    error.brokerReason = reason;
  }
  return error;
}
