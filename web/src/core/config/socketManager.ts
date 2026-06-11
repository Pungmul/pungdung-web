import {
  type CreateSocketManagerOptions,
  SocketManager,
} from "@pungdung/worker-socket-bridge";

/** SocketManager 기본 옵션. 앱/환경별로 이 파일에서 조정한다. */
export const defaultSocketManagerOptions = {
  commandTimeoutMs: 30_000,
  graceMs: 30_000,
  maxMessagesPerTopic: 100,
  messageInactivityProbeMs: 3 * 60_000,
  basePath: "/",
  sharedWorkerFile: "socket-worker.js",
  dedicatedWorkerFile: "dedicated-worker.js",
} satisfies CreateSocketManagerOptions;

export function makeSocketManager() {
  return new SocketManager(defaultSocketManagerOptions);
}

let browserSocketManager: SocketManager | undefined;

export function getSocketManager() {
  if (typeof window === "undefined") {
    throw new Error("getSocketManager() must only be called in the browser");
  }

  if (!browserSocketManager) {
    browserSocketManager = makeSocketManager();
  }

  return browserSocketManager;
}

export type { CreateSocketManagerOptions, SocketManager };
