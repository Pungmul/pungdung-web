import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  APP_SERVICE_WORKER_PATH,
  getAppServiceWorkerRegistration,
  registerAppServiceWorker,
} from "./app-service-worker";

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

describe("getAppServiceWorkerRegistration", () => {
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

    const result = await getAppServiceWorkerRegistration();

    expect(result).toBeNull();
  });

  it("등록 정보가 하나도 없으면 null을 반환해야 한다", async () => {
    getRegistrationsMock.mockResolvedValue([]);

    const result = await getAppServiceWorkerRegistration();

    expect(result).toBeNull();
  });

  it("앱 스크립트 경로와 일치하는 등록 정보가 없으면 null을 반환해야 한다", async () => {
    getRegistrationsMock.mockResolvedValue([
      makeRegistration("https://example.com/other-sw.js"),
    ]);

    const result = await getAppServiceWorkerRegistration();

    expect(result).toBeNull();
  });

  it("워커 경로가 APP_SERVICE_WORKER_PATH와 일치하면 해당 등록 정보를 반환해야 한다", async () => {
    const matching = makeRegistration(
      `https://example.com${APP_SERVICE_WORKER_PATH}?v=1`
    );
    getRegistrationsMock.mockResolvedValue([
      makeRegistration("https://example.com/other-sw.js"),
      matching,
    ]);

    const result = await getAppServiceWorkerRegistration();

    expect(result).toBe(matching);
  });

  it("active가 없고 waiting 워커 경로가 일치하면 해당 등록 정보를 반환해야 한다", async () => {
    const matching = makeRegistrationWithWorkerInSlot(
      `https://example.com${APP_SERVICE_WORKER_PATH}?v=1`,
      "waiting"
    );
    getRegistrationsMock.mockResolvedValue([
      makeRegistration("https://example.com/other-sw.js"),
      matching,
    ]);

    const result = await getAppServiceWorkerRegistration();

    expect(result).toBe(matching);
  });
});

describe("registerAppServiceWorker", () => {
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    navigator,
    "serviceWorker"
  );

  let getRegistrationsMock: ReturnType<typeof vi.fn>;
  let registerMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getRegistrationsMock = vi.fn();
    registerMock = vi.fn();
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      writable: true,
      value: {
        getRegistrations: getRegistrationsMock,
        register: registerMock,
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

  it("이미 앱 SW가 있으면 register를 호출하지 않아야 한다", async () => {
    const matching = makeRegistration(
      `https://example.com${APP_SERVICE_WORKER_PATH}`
    );
    getRegistrationsMock.mockResolvedValue([matching]);

    const result = await registerAppServiceWorker();

    expect(result).toBe(matching);
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("앱 SW가 없으면 APP_SERVICE_WORKER_PATH로 register해야 한다", async () => {
    const created = makeRegistration(
      `https://example.com${APP_SERVICE_WORKER_PATH}`
    );
    getRegistrationsMock.mockResolvedValue([]);
    registerMock.mockResolvedValue(created);

    const result = await registerAppServiceWorker();

    expect(registerMock).toHaveBeenCalledWith(APP_SERVICE_WORKER_PATH);
    expect(result).toBe(created);
  });
});
