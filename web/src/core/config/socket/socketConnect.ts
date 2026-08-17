import type { SocketConfig, SocketStompConfig } from "@pungdung/worker-socket-bridge/protocol";

import { isE2ERuntime } from "./e2eRuntime";

export type { CreateSocketConnectConfig } from "@pungdung/worker-socket-bridge/react";

const rawSocketUrl =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "http://localhost:8080/ws";

/**
 * SockJS 생성자는 http(s) 엔드포인트를 받는다.
 * env에 ws(s):// 가 들어와도 http(s):// 로 맞춘다.
 */
export function normalizeSocketUrl(url: string): string {
  if (url.startsWith("wss://")) {
    return `https://${url.slice("wss://".length)}`;
  }
  if (url.startsWith("ws://")) {
    return `http://${url.slice("ws://".length)}`;
  }
  return url;
}

export const defaultSocketUrl = normalizeSocketUrl(rawSocketUrl);

/** STOMP 클라이언트 기본 옵션. 앱/환경별로 이 파일에서 조정한다. */
export const defaultStompConfig = {
  // E2E는 close 후 복구 검증을 위해 재연결 대기를 줄임
  reconnectDelay: isE2ERuntime() ? 200 : 5000,
  /** 탭이 살아 있을 때 idle disconnect를 줄이기 위한 heartbeat */
  heartbeatIncoming: 10_000,
  heartbeatOutgoing: 10_000,
} satisfies SocketStompConfig;

/** 인증 토큰으로 worker CONNECT에 넘길 `SocketConfig`를 만든다. */
export function createAuthenticatedSocketConfig(
  accessToken: string
): SocketConfig {
  return {
    url: defaultSocketUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    // Playwright routeWebSocket은 SockJS XHR fallback을 잡지 못함
    ...(isE2ERuntime()
      ? { sockJsOptions: { transports: ["websocket"] } }
      : {}),
    stomp: defaultStompConfig,
  };
}
