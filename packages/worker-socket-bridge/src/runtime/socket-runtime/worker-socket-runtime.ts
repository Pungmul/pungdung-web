import type { ResponseEnvelope } from "../../protocol";
import type { WorkerTransport } from "../types";

import { BaseSocketRuntime } from "./base-socket-runtime";

export class WorkerSocketRuntime extends BaseSocketRuntime {
  readonly mode: WorkerTransport["mode"];

  constructor(private readonly transport: WorkerTransport) {
    super((envelope) => {
      transport.postMessage(envelope);
    });
    this.mode = transport.mode;
  }

  setMessageHandler(handler: (response: ResponseEnvelope) => void): void {
    this.transport.setMessageHandler(handler);
  }

  dispose(): void {
    this.clearDispatchQueue();
    this.transport.dispose();
  }
}
