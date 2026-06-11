import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  FCM_SERVICE_WORKER_PATH,
  getFCMServiceWorkerRegistration,
} from "./get-fcm-service-worker-registration.service";

function makeRegistration(scriptURL: string) {
  const worker = { scriptURL } as ServiceWorker;
  return {
    active: worker,
    waiting: undefined,
    installing: undefined,
  } as unknown as ServiceWorkerRegistration;
}

function makeRegistrationWithWorkerInSlot(
  scriptURL: string,
  slot: "waiting" | "installing"
) {
  const worker = { scriptURL } as ServiceWorker;
  return {
    active: undefined,
    waiting: slot === "waiting" ? worker : undefined,
    installing: slot === "installing" ? worker : undefined,
  } as unknown as ServiceWorkerRegistration;
}

describe("getFCMServiceWorkerRegistration", () => {
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    navigator,
    "serviceWorker"
  );

  let getRegistrationsMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getRegistrationsMock = vi.fn();
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      writable: true,
      value: {
        getRegistrations: getRegistrationsMock,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalDescriptor) {
      Object.defineProperty(navigator, "serviceWorker", originalDescriptor);
    } else {
      Reflect.deleteProperty(navigator, "serviceWorker");
    }
  });

  it("serviceWorker.getRegistrations를 사용할 수 없으면 null을 반환해야 한다", async () => {
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      writable: true,
      value: {},
    });

    const result = await getFCMServiceWorkerRegistration();

    expect(result).toBeNull();
  });

  it("등록 정보가 하나도 없으면 null을 반환해야 한다", async () => {
    getRegistrationsMock.mockResolvedValue([]);

    const result = await getFCMServiceWorkerRegistration();

    expect(result).toBeNull();
  });

  it("FCM 스크립트 경로와 일치하는 등록 정보가 없으면 null을 반환해야 한다", async () => {
    getRegistrationsMock.mockResolvedValue([
      makeRegistration("https://example.com/other-sw.js"),
    ]);

    const result = await getFCMServiceWorkerRegistration();

    expect(result).toBeNull();
  });

  it("워커 경로가 FCM_SERVICE_WORKER_PATH와 일치하면 해당 등록 정보를 반환해야 한다", async () => {
    const matching = makeRegistration(
      `https://example.com${FCM_SERVICE_WORKER_PATH}?v=1`
    );
    getRegistrationsMock.mockResolvedValue([
      makeRegistration("https://example.com/other-sw.js"),
      matching,
    ]);

    const result = await getFCMServiceWorkerRegistration();

    expect(result).toBe(matching);
  });

  it("active가 없고 waiting 워커 경로가 일치하면 해당 등록 정보를 반환해야 한다", async () => {
    const matching = makeRegistrationWithWorkerInSlot(
      `https://example.com${FCM_SERVICE_WORKER_PATH}?v=1`,
      "waiting"
    );
    getRegistrationsMock.mockResolvedValue([
      makeRegistration("https://example.com/other-sw.js"),
      matching,
    ]);

    const result = await getFCMServiceWorkerRegistration();

    expect(result).toBe(matching);
  });
});
