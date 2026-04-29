import type { CommandEnvelope } from "../src/protocol";
import { createStompSession } from "../stomp/create-stomp-session";

const session = createStompSession((message) => {
  self.postMessage(message);
});

self.addEventListener("message", (event: MessageEvent<CommandEnvelope>) => {
  const envelope = event.data;

  if (envelope.type === "PING") {
    self.postMessage({
      type: "PONG",
      commandId: envelope.commandId,
      data: session.getConnectionProbe(),
    });
    return;
  }

  session.handleCommand(envelope);
});
