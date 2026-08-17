import {
  type CreateSocketManagerOptions,
  SocketManager,
} from "@pungdung/worker-socket-bridge";

import { isE2ERuntime } from "./e2eRuntime";

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
  const options: CreateSocketManagerOptions = isE2ERuntime()
    ? {
        ...defaultSocketManagerOptions,
        // SharedWorker WS는 Playwright가 인터셉트하지 못하므로 E2E만 main-thread 고정
        fallbackChain: ["main-thread"],
      }
    : defaultSocketManagerOptions;

  return new SocketManager(options);
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
