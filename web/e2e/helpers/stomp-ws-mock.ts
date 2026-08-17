import type { Page, WebSocketRoute } from "@playwright/test";

type Subscription = {
  id: string;
  destination: string;
};

export type StompWsMock = {
  waitForSubscription: (destination: string) => Promise<Subscription>;
  publish: (destination: string, body: unknown) => void;
  close: () => void;
};

function createStompFrame(
  command: string,
  headers: Record<string, string>,
  body = ""
): string {
  const serializedHeaders = Object.entries(headers)
    .map(([key, value]) => `${key}:${value}`)
    .join("\n");
  return `${command}\n${serializedHeaders}\n\n${body}\0`;
}

function parseStompCommand(raw: string): {
  command: string;
  headers: Record<string, string>;
} {
  const [headerBlock] = raw.split("\n\n");
  const lines = headerBlock.split("\n");
  const command = lines[0] ?? "";
  const headers: Record<string, string> = {};
  for (const line of lines.slice(1)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    headers[line.slice(0, idx)] = line.slice(idx + 1);
  }
  return { command, headers };
}

function unwrapSockJsClientPayload(message: string | Buffer): string[] {
  const text = typeof message === "string" ? message : message.toString("utf8");
  if (!text || text === "\n") {
    return [];
  }
  try {
    const parsed = JSON.parse(text) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
  } catch {
    // SockJS 없이 raw STOMP가 올 수 있음
  }
  return [text];
}

function sockJsOpenFrame(): string {
  return "o";
}

function sockJsMessageFrame(payload: string): string {
  return `a${JSON.stringify([payload])}`;
}

// SockJS websocket transport 위 STOMP mock (E2E: NEXT_PUBLIC_E2E=1 + main-thread)
export async function installStompWsMock(page: Page): Promise<StompWsMock> {
  let activeWs: WebSocketRoute | null = null;
  const subscriptions = new Map<string, Subscription>();
  const waiters = new Map<
    string,
    {
      resolve: (value: Subscription) => void;
      reject: (reason: Error) => void;
      promise: Promise<Subscription>;
    }
  >();

  const ensureWaiter = (destination: string) => {
    const existing = waiters.get(destination);
    if (existing) return existing.promise;
    let resolve!: (value: Subscription) => void;
    let reject!: (reason: Error) => void;
    const promise = new Promise<Subscription>((next, fail) => {
      resolve = next;
      reject = fail;
    });
    waiters.set(destination, { resolve, reject, promise });
    return promise;
  };

  const sendStomp = (frame: string) => {
    if (!activeWs) {
      throw new Error("STOMP WebSocket is not connected");
    }
    activeWs.send(sockJsMessageFrame(frame));
  };

  // SockJS는 WS 연결 전에 /info 핸드셰이크가 필요하다.
  await page.route("**/ws/info**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json;charset=UTF-8",
      headers: {
        "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
      },
      body: JSON.stringify({
        websocket: true,
        cookie_needed: false,
        origins: ["*:*"],
        entropy: 1_726_000_000,
      }),
    });
  });

  await page.routeWebSocket(/\/ws\/.*\/websocket/, (ws) => {
    activeWs = ws;
    ws.send(sockJsOpenFrame());

    ws.onMessage((message) => {
      for (const raw of unwrapSockJsClientPayload(message)) {
        const { command, headers } = parseStompCommand(raw);
        if (command === "CONNECT" || command === "STOMP") {
          sendStomp(
            createStompFrame("CONNECTED", {
              version: "1.2",
              "heart-beat": "10000,10000",
            })
          );
          continue;
        }
        if (command === "SUBSCRIBE") {
          const destination = headers.destination ?? "";
          const id = headers.id ?? `sub-${subscriptions.size + 1}`;
          const subscription = { id, destination };
          subscriptions.set(destination, subscription);
          waiters.get(destination)?.resolve(subscription);
          waiters.delete(destination);
          continue;
        }
        if (command === "DISCONNECT") {
          const receiptId = headers.receipt;
          if (receiptId) {
            sendStomp(
              createStompFrame("RECEIPT", {
                "receipt-id": receiptId,
              })
            );
          }
          ws.close();
        }
      }
    });
  });

  return {
    waitForSubscription: (destination) => {
      const existing = subscriptions.get(destination);
      if (existing) return Promise.resolve(existing);
      return ensureWaiter(destination);
    },
    publish: (destination, body) => {
      const subscription = subscriptions.get(destination);
      if (!subscription) {
        throw new Error(`No subscription for ${destination}`);
      }
      const payload = JSON.stringify(body);
      sendStomp(
        createStompFrame(
          "MESSAGE",
          {
            destination,
            subscription: subscription.id,
            "content-type": "application/json",
            "content-length": String(Buffer.byteLength(payload)),
          },
          payload
        )
      );
    },
    close: () => {
      subscriptions.clear();
      const closed = new Error("STOMP WebSocket closed");
      waiters.forEach((waiter) => {
        waiter.reject(closed);
      });
      waiters.clear();
      activeWs?.close();
      activeWs = null;
    },
  };
}
