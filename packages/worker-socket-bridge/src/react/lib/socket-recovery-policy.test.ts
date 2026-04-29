import { describe, expect, it } from "vitest";

import {
  shouldBypassRecoveryCooldown,
  shouldForceRecreateAfterBackground,
  shouldRecreateRuntime,
} from "./socket-recovery-policy";

describe("socket-recovery-policy", () => {
  it("should bypass recovery cooldown for urgent triggers", () => {
    expect(shouldBypassRecoveryCooldown("foreground")).toBe(true);
    expect(shouldBypassRecoveryCooldown("heartbeat-lost")).toBe(true);
    expect(shouldBypassRecoveryCooldown("watch-probe")).toBe(false);
  });

  it("should force recreate after long foreground background", () => {
    expect(
      shouldForceRecreateAfterBackground(20_000, 20_000, "foreground")
    ).toBe(true);
    expect(
      shouldForceRecreateAfterBackground(5_000, 20_000, "foreground")
    ).toBe(false);
    expect(
      shouldForceRecreateAfterBackground(60_000, 20_000, "watch-probe")
    ).toBe(false);
  });

  it("should recreate runtime when forceRecreate is set", () => {
    expect(
      shouldRecreateRuntime({
        forceRecreate: true,
        backgroundDurationMs: 0,
        backgroundForceReconnectMs: 30_000,
        workerAlive: true,
      })
    ).toBe(true);
  });

  it("should not recreate runtime when reconnectOnly is set", () => {
    expect(
      shouldRecreateRuntime({
        reconnectOnly: true,
        forceRecreate: true,
        backgroundDurationMs: 60_000,
        backgroundForceReconnectMs: 30_000,
        workerAlive: false,
      })
    ).toBe(false);
  });
});
