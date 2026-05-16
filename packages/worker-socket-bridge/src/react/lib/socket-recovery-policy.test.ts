import { describe, expect, it } from "vitest";

import {
  shouldBypassRecoveryCooldown,
  shouldBypassStateCheckInFlight,
  shouldRecreateRuntime,
} from "./socket-recovery-policy";

describe("socket-recovery-policy", () => {
  it("should bypass recovery cooldown for urgent triggers", () => {
    expect(shouldBypassRecoveryCooldown("foreground")).toBe(true);
    expect(shouldBypassRecoveryCooldown("heartbeat-lost")).toBe(true);
    expect(shouldBypassRecoveryCooldown("watch-probe")).toBe(false);
  });

  it("should bypass in-flight guard for urgent foreground checks", () => {
    expect(shouldBypassStateCheckInFlight("foreground", true)).toBe(true);
    expect(shouldBypassStateCheckInFlight("online", true)).toBe(true);
    expect(shouldBypassStateCheckInFlight("foreground", false)).toBe(false);
    expect(shouldBypassStateCheckInFlight("watch-probe", true)).toBe(false);
  });

  it("should recreate runtime when forceRecreate is set", () => {
    expect(
      shouldRecreateRuntime({
        forceRecreate: true,
        workerAlive: true,
      })
    ).toBe(true);
  });

  it("should not recreate runtime when reconnectOnly is set", () => {
    expect(
      shouldRecreateRuntime({
        reconnectOnly: true,
        forceRecreate: true,
        workerAlive: false,
      })
    ).toBe(false);
  });

  it("should recreate runtime only when worker is not alive", () => {
    expect(
      shouldRecreateRuntime({
        workerAlive: false,
      })
    ).toBe(true);

    expect(
      shouldRecreateRuntime({
        workerAlive: true,
      })
    ).toBe(false);
  });
});
