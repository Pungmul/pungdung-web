import { describe, expect, it } from "vitest";

import { supportsNotification, supportsPushNotification } from ".";

describe("supportsNotification", () => {
  it("window에 Notification이 없으면 false를 반환해야 한다", () => {
    const had = "Notification" in window;
    const original = had ? window.Notification : undefined;

    try {
      Reflect.deleteProperty(window, "Notification");
      expect(supportsNotification()).toBe(false);
    } finally {
      if (had && original !== undefined) {
        Reflect.set(window, "Notification", original);
      }
    }
  });

  it("window에 Notification이 있으면 true를 반환해야 한다", () => {
    if (!("Notification" in window)) {
      class NotificationStub {
        static permission: NotificationPermission = "default";
      }
      Reflect.set(window, "Notification", NotificationStub);
    }

    expect(supportsNotification()).toBe(true);
  });
});

describe("supportsPushNotification", () => {
  it("navigator에 serviceWorker 속성이 없으면 false를 반환해야 한다", () => {
    const swDesc = Object.getOwnPropertyDescriptor(navigator, "serviceWorker");
    if (!("Notification" in window)) {
      class NotificationStub {
        static permission: NotificationPermission = "default";
      }
      Reflect.set(window, "Notification", NotificationStub);
    }

    try {
      Reflect.deleteProperty(navigator, "serviceWorker");
      expect(supportsPushNotification()).toBe(false);
    } finally {
      if (swDesc) {
        Object.defineProperty(navigator, "serviceWorker", swDesc);
      }
    }
  });

  it("Notification과 navigator.serviceWorker가 모두 있으면 true를 반환해야 한다", () => {
    if (!("Notification" in window)) {
      class NotificationStub {
        static permission: NotificationPermission = "default";
      }
      Reflect.set(window, "Notification", NotificationStub);
    }

    const swDesc = Object.getOwnPropertyDescriptor(navigator, "serviceWorker");
    try {
      Object.defineProperty(navigator, "serviceWorker", {
        configurable: true,
        writable: true,
        value: {},
      });
      expect(supportsPushNotification()).toBe(true);
    } finally {
      if (swDesc) {
        Object.defineProperty(navigator, "serviceWorker", swDesc);
      } else {
        Reflect.deleteProperty(navigator, "serviceWorker");
      }
    }
  });
});
