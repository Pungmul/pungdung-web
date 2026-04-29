import { describe, expect, it, vi } from "vitest";

import { HEARTBEAT_LOST_REASON } from "./constants";
import {
  createStompLivenessTracker,
  createTransportRecoverySignal,
  isHeartbeatLostReason,
  readTransportRecoverySignal,
  resolveHeartbeatStaleThresholdMs,
} from "./stomp-liveness";

describe("stomp-liveness", () => {
  it("should resolve stale threshold from heartbeat config", () => {
    expect(
      resolveHeartbeatStaleThresholdMs({
        heartbeatIncoming: 10_000,
        heartbeatOutgoing: 5_000,
      })
    ).toBe(20_000);
  });

  it("should mark server activity stale after threshold", () => {
    const tracker = createStompLivenessTracker(1_000);
    tracker.touchServerActivity();

    expect(tracker.isServerActivityStale(true)).toBe(false);

    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now + 1_001);

    expect(tracker.isServerActivityStale(true)).toBe(true);

    vi.restoreAllMocks();
  });

  it("should read transport recovery signal", () => {
    const signal = createTransportRecoverySignal(HEARTBEAT_LOST_REASON, true);

    expect(readTransportRecoverySignal(signal)).toEqual({
      reason: HEARTBEAT_LOST_REASON,
      forceRecreate: true,
    });
    expect(isHeartbeatLostReason(HEARTBEAT_LOST_REASON)).toBe(true);
  });
});
