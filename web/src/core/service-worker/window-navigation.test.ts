import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";

import { readServiceWorkerEntry } from "./ServiceWorkerNavigation/restore-entry-history";
import { SERVICE_WORKER_NAVIGATE, SERVICE_WORKER_NAVIGATION_ACK } from "./navigation-contract";

const source = readFileSync("public/service-worker/window-navigation.js", "utf8");
const target = { href: "/board/d/30", parents: ["/home", "/board/main"] };
type ReplyPort = { postMessage: (data: unknown) => void };
function makeClient(acknowledge = true) {
  return {
    url: "https://app.test/home", focused: true, frameType: "top-level",
    focus: vi.fn().mockResolvedValue(undefined),
    navigate: vi.fn().mockResolvedValue({}),
    postMessage: vi.fn((_data: unknown, [port]: ReplyPort[]) => {
      if (acknowledge) port?.postMessage({ type: SERVICE_WORKER_NAVIGATION_ACK });
    }),
  };
}

function createWorker(windows: ReturnType<typeof makeClient>[] = []) {
  class Channel {
    port1 = { onmessage: (_event: { data: unknown }) => {}, close: vi.fn() };
    port2 = { postMessage: (data: unknown) => this.port1.onmessage({ data }) };
  }
  const self = {
    location: { origin: "https://app.test" },
    clients: {
      matchAll: vi.fn().mockResolvedValue(windows),
      openWindow: vi.fn<(url: string) => Promise<void>>().mockResolvedValue(undefined),
    },
    pungdungWindowNavigation: { open: (_target: typeof target | null): Promise<void> => Promise.resolve() },
  };
  runInNewContext(source, { self, MessageChannel: Channel, URL, setTimeout, clearTimeout });
  return self;
}

describe("서비스 워커 창 이동", () => {
  afterEach(() => vi.useRealTimers());

  it("기존 창을 focus하고 core가 읽는 메시지를 전달한다", async () => {
    const client = makeClient();
    const worker = createWorker([client]);
    await worker.pungdungWindowNavigation.open(target);
    expect(client.focus).toHaveBeenCalledOnce();
    expect(client.postMessage.mock.calls[0]?.[0]).toEqual({ type: SERVICE_WORKER_NAVIGATE, href: target.href });
    expect(client.postMessage.mock.calls[0]?.[1]).toHaveLength(1);
    expect(client.navigate).not.toHaveBeenCalled();
    expect(worker.clients.openWindow).not.toHaveBeenCalled();
  });

  it("응답 없는 이전 앱은 히스토리 표시 없이 URL로 이동한다", async () => {
    vi.useFakeTimers();
    const client = makeClient(false);
    const worker = createWorker([client]);
    const navigation = worker.pungdungWindowNavigation.open(target);
    await vi.runAllTimersAsync();
    await navigation;
    expect(client.navigate).toHaveBeenCalledWith(target.href);
  });

  it("창이 없을 때만 core가 해석하는 콜드 스타트 URL을 연다", async () => {
    const worker = createWorker();
    await worker.pungdungWindowNavigation.open(target);
    const href = worker.clients.openWindow.mock.calls[0]?.[0] ?? "";
    expect(readServiceWorkerEntry(new URL(href))).toEqual(target);
  });

  it("목적지 없는 알림은 기존 창을 유지하고 콜드 스타트는 알림 목록을 연다", async () => {
    const client = makeClient();
    await createWorker([client]).pungdungWindowNavigation.open(null);
    expect(client.postMessage).not.toHaveBeenCalled();
    const worker = createWorker();
    await worker.pungdungWindowNavigation.open(null);
    expect(readServiceWorkerEntry(new URL(worker.clients.openWindow.mock.calls[0]?.[0] ?? "")))
      .toEqual({ href: "/notification", parents: ["/home"] });
  });
});
