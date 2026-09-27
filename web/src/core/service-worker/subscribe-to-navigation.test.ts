import { afterEach, describe, expect, it, vi } from "vitest";

import { SERVICE_WORKER_NAVIGATE, SERVICE_WORKER_NAVIGATION_ACK } from "./navigation-contract";
import { subscribeToServiceWorkerNavigation } from "./subscribe-to-navigation";

describe("서비스 워커 메시지 구독", () => {
  const originalDescriptor = Object.getOwnPropertyDescriptor(navigator, "serviceWorker");
  afterEach(() => {
    if (originalDescriptor) Object.defineProperty(navigator, "serviceWorker", originalDescriptor);
    else Reflect.deleteProperty(navigator, "serviceWorker");
    vi.restoreAllMocks();
  });

  it("앱 SW의 이동을 전달하고 응답하며 구독 해제 후에는 처리하지 않는다", () => {
    const serviceWorker = new EventTarget();
    Object.defineProperty(navigator, "serviceWorker", { configurable: true, value: serviceWorker });
    const navigate = vi.fn();
    const ack = vi.fn();
    const unsubscribe = subscribeToServiceWorkerNavigation(navigate);
    const makeEvent = (scriptURL = `${window.location.origin}/pungdung-sw.js`) => {
      const event = new MessageEvent("message", {
        origin: window.location.origin,
        data: { type: SERVICE_WORKER_NAVIGATE, href: "/board/d/30" },
      });
      Object.defineProperties(event, {
        source: { value: { scriptURL } },
        ports: { value: [{ postMessage: ack }] },
      });
      return event;
    };

    serviceWorker.dispatchEvent(makeEvent("https://evil.test/pungdung-sw.js"));
    expect(navigate).not.toHaveBeenCalled();
    serviceWorker.dispatchEvent(makeEvent());
    expect(navigate).toHaveBeenCalledExactlyOnceWith("/board/d/30");
    expect(ack).toHaveBeenCalledExactlyOnceWith({ type: SERVICE_WORKER_NAVIGATION_ACK });
    unsubscribe();
    serviceWorker.dispatchEvent(makeEvent());
    expect(navigate).toHaveBeenCalledTimes(1);
  });
});
