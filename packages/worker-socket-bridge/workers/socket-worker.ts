import { createSharedStompHub } from "./shared-stomp-hub";

const hub = createSharedStompHub();

self.addEventListener("connect", (event: Event) => {
  const connectEvent = event as MessageEvent & { ports: MessagePort[] };
  const port = connectEvent.ports[0];
  if (!port) {
    return;
  }
  hub.connectClient(port);
});
