import { expect, test } from "@playwright/test";
import { build } from "esbuild";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import SockJS from "sockjs";

const e2eDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageDirectory = path.resolve(e2eDirectory, "..");
const topic = "/topic/e2e";

function createDeferred() {
  let resolve = () => {};
  const promise = new Promise((nextResolve) => {
    resolve = nextResolve;
  });
  return { promise, resolve };
}

function createStompFrame(command, headers, body = "") {
  const serializedHeaders = Object.entries(headers)
    .map(([key, value]) => `${key}:${value}`)
    .join("\n");

  return `${command}\n${serializedHeaders}\n\n${body}\0`;
}

async function buildBrowserAssets() {
  const workerBuild = await build({
    entryPoints: [path.join(packageDirectory, "workers/socket-worker.ts")],
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2020",
    define: { global: "globalThis" },
    write: false,
  });
  const clientBuild = await build({
    entryPoints: [path.join(e2eDirectory, "browser-entry.ts")],
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2020",
    define: { global: "globalThis" },
    write: false,
  });

  return new Map([
    ["/socket-worker.js", workerBuild.outputFiles[0].text],
    ["/socket-bridge-e2e.js", clientBuild.outputFiles[0].text],
  ]);
}

async function createStompFixture() {
  const assets = await buildBrowserAssets();
  const subscribed = createDeferred();
  let socketConnection = null;
  let subscriptionId = null;

  const server = createServer((request, response) => {
    const asset = assets.get(request.url ?? "");
    if (asset) {
      response.writeHead(200, { "content-type": "application/javascript" });
      response.end(asset);
      return;
    }

    if (request.url === "/") {
      response.writeHead(200, { "content-type": "text/html" });
      response.end('<script src="/socket-bridge-e2e.js"></script>');
      return;
    }

    response.writeHead(404).end();
  });
  // 실제 socket bridge와 같은 SockJS 경로에서 필요한 STOMP 프레임만 처리
  const sockjs = SockJS.createServer({ prefix: "/socket" });

  sockjs.on("connection", (connection) => {
    socketConnection = connection;
    connection.on("data", (rawFrame) => {
      if (rawFrame.startsWith("CONNECT\n")) {
        connection.write(createStompFrame("CONNECTED", { version: "1.2" }));
        return;
      }

      if (rawFrame.startsWith("SUBSCRIBE\n") && rawFrame.includes(`destination:${topic}`)) {
        // MESSAGE를 어느 구독 콜백으로 보낼지 서버가 subscription id를 보관
        subscriptionId = rawFrame.match(/\nid:([^\n]+)/)?.[1] ?? null;
        subscribed.resolve();
        return;
      }

      if (rawFrame.startsWith("DISCONNECT\n")) {
        // deactivate가 끝날 수 있도록 receipt를 돌려주고 소켓도 닫음
        const receiptId = rawFrame.match(/\nreceipt:([^\n]+)/)?.[1];
        if (receiptId) {
          connection.write(createStompFrame("RECEIPT", { "receipt-id": receiptId }));
        }
        connection.close();
      }
    });
  });
  sockjs.installHandlers(server, { prefix: "/socket" });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to resolve the STOMP fixture address");
  }

  const origin = `http://127.0.0.1:${address.port}`;
  return {
    origin,
    socketUrl: `${origin}/socket`,
    publish(message) {
      if (!socketConnection) {
        throw new Error("STOMP client is not connected");
      }
      if (!subscriptionId) {
        throw new Error("STOMP client has not subscribed to the test topic");
      }
      const body = JSON.stringify(message);
      socketConnection.write(
        createStompFrame(
          "MESSAGE",
          {
            destination: topic,
            subscription: subscriptionId,
            "content-type": "application/json",
            "content-length": String(Buffer.byteLength(body)),
          },
          body
        )
      );
    },
    waitForSubscription: () => subscribed.promise,
    close: () => closeServer(server),
  };
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

test.describe("SharedWorker 소켓 브릿지", () => {
  let fixture;

  test.beforeAll(async () => {
    fixture = await createStompFixture();
  });

  test.afterAll(async () => {
    await fixture.close();
  });

  test("STOMP MESSAGE를 SocketManager 구독 콜백까지 전달한다", async ({ page }) => {
    await page.goto(fixture.origin);

    const runtimeMode = await page.evaluate((socketUrl) => {
      return window.socketBridgeE2e.connectAndSubscribe(socketUrl);
    }, fixture.socketUrl);
    expect(runtimeMode).toBe("shared");

    await fixture.waitForSubscription();
    fixture.publish({ id: "message-1", text: "hello from STOMP" });

    await expect.poll(() =>
      page.evaluate(() => window.socketBridgeE2e.getReceivedMessages())
    ).toEqual([{ id: "message-1", text: "hello from STOMP" }]);

    await page.evaluate(() => window.socketBridgeE2e.disconnect());
  });
});
