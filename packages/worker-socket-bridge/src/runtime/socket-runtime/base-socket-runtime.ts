import type { CommandEnvelope, ResponseEnvelope } from "../../protocol";
import {
  createPriorityDispatchQueue,
  type DispatchResult,
  type PriorityDispatchQueue,
} from "../dispatch";
import type { SocketRuntime, SocketRuntimeMode } from "../types";

export abstract class BaseSocketRuntime implements SocketRuntime {
  abstract readonly mode: SocketRuntimeMode;

  private readonly dispatchQueue: PriorityDispatchQueue;

  protected constructor(sink: (envelope: CommandEnvelope) => void) {
    this.dispatchQueue = createPriorityDispatchQueue(sink);
  }

  dispatch(envelope: CommandEnvelope): DispatchResult {
    return this.dispatchQueue.enqueue(envelope);
  }

  protected clearDispatchQueue(): void {
    this.dispatchQueue.clear();
  }

  protected getDispatchQueue(): PriorityDispatchQueue {
    return this.dispatchQueue;
  }

  abstract setMessageHandler(
    handler: (response: ResponseEnvelope) => void
  ): void;

  abstract dispose(): void;
}
