import { createStompSession, type StompSession } from "../../../stomp/create-stomp-session";
import type { ResponseEnvelope } from "../../protocol";

import { BaseSocketRuntime } from "./base-socket-runtime";

export class MainThreadSocketRuntime extends BaseSocketRuntime {
  readonly mode = "main-thread" as const;

  private messageHandler: ((response: ResponseEnvelope) => void) | null = null;
  private readonly stompSession: StompSession;

  constructor() {
    super((envelope) => {
      if (envelope.type === "PING") {
        this.messageHandler?.({
          type: "PONG",
          data: this.stompSession.getConnectionProbe(),
          ...(envelope.commandId ? { commandId: envelope.commandId } : {}),
        });
        return;
      }

      this.stompSession.handleCommand(envelope);
    });
    this.stompSession = createStompSession((response) => {
      this.messageHandler?.(response);
    });
  }

  setMessageHandler(handler: (response: ResponseEnvelope) => void): void {
    this.messageHandler = handler;
  }

  dispose(): void {
    this.clearDispatchQueue();
    this.stompSession.dispose();
    this.messageHandler = null;
  }
}
