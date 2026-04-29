import type { CommandEnvelope, ResponseEnvelope } from "../../protocol";
import type { WorkerTransport } from "../types";

const DEDICATED_WORKER_URL = "/dedicated-worker.js";

export class DedicatedWorkerTransport implements WorkerTransport {
  readonly mode = "dedicated" as const;
  private messageListener: ((event: MessageEvent) => void) | null = null;

  constructor(private readonly worker: Worker) {}

  static create(url: string = DEDICATED_WORKER_URL): DedicatedWorkerTransport {
    return new DedicatedWorkerTransport(new Worker(url));
  }

  postMessage(message: CommandEnvelope): void {
    this.worker.postMessage(message);
  }

  setMessageHandler(handler: (response: ResponseEnvelope) => void): void {
    this.clearMessageHandler();
    this.messageListener = (event: MessageEvent) => {
      handler(event.data as ResponseEnvelope);
    };
    this.worker.addEventListener("message", this.messageListener);
  }

  dispose(): void {
    this.clearMessageHandler();
    this.worker.terminate();
  }

  private clearMessageHandler(): void {
    if (!this.messageListener) {
      return;
    }
    this.worker.removeEventListener("message", this.messageListener);
    this.messageListener = null;
  }
}
