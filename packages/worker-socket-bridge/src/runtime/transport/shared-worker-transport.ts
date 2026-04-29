import type { CommandEnvelope, ResponseEnvelope } from "../../protocol";
import type { WorkerTransport } from "../types";

const SHARED_WORKER_URL = "/socket-worker.js";

export class SharedWorkerTransport implements WorkerTransport {
  readonly mode = "shared" as const;
  private messageListener: ((event: MessageEvent) => void) | null = null;

  constructor(private readonly sharedWorker: SharedWorker) {
    this.sharedWorker.port.start();
  }

  static create(url: string = SHARED_WORKER_URL): SharedWorkerTransport {
    return new SharedWorkerTransport(new SharedWorker(url));
  }

  postMessage(message: CommandEnvelope): void {
    this.sharedWorker.port.postMessage(message);
  }

  setMessageHandler(handler: (response: ResponseEnvelope) => void): void {
    this.clearMessageHandler();
    this.messageListener = (event: MessageEvent) => {
      handler(event.data as ResponseEnvelope);
    };
    this.sharedWorker.port.addEventListener("message", this.messageListener);
  }

  dispose(): void {
    this.clearMessageHandler();
    this.sharedWorker.port.close();
  }

  private clearMessageHandler(): void {
    if (!this.messageListener) {
      return;
    }
    this.sharedWorker.port.removeEventListener("message", this.messageListener);
    this.messageListener = null;
  }
}
