import type { CommandEnvelope, ResponseEnvelope } from "../protocol";

import type { DispatchResult } from "./dispatch";

export type SocketRuntimeMode = "shared" | "dedicated" | "main-thread";

export interface SocketRuntime {
  readonly mode: SocketRuntimeMode;
  dispatch(envelope: CommandEnvelope): DispatchResult;
  setMessageHandler(handler: (response: ResponseEnvelope) => void): void;
  dispose(): void;
}

export interface WorkerTransport {
  readonly mode: "shared" | "dedicated";
  postMessage(message: CommandEnvelope): void;
  setMessageHandler(handler: (response: ResponseEnvelope) => void): void;
  dispose(): void;
}
