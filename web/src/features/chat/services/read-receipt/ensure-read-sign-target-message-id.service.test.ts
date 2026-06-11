import { describe, expect, it } from "vitest";

import { ensureReadSignTargetMessageId } from "./ensure-read-sign-target-message-id.service";

describe("ensureReadSignTargetMessageId", () => {
  it("upToMessageId가 있으면 max 병합한다", () => {
    expect(
      ensureReadSignTargetMessageId({
        currentTargetMessageId: 100,
        upToMessageId: 105,
      })
    ).toBe(105);
  });

  it("upToMessageId가 없으면 기존 target을 유지한다", () => {
    expect(
      ensureReadSignTargetMessageId({
        currentTargetMessageId: 100,
      })
    ).toBe(100);
  });

  it("target이 없으면 타임라인 최신 id로 보완한다", () => {
    expect(
      ensureReadSignTargetMessageId({
        currentTargetMessageId: null,
        timelineMessages: [{ id: 10 }, { id: 15 }],
      })
    ).toBe(15);
  });

  it("확정할 id가 없으면 null", () => {
    expect(
      ensureReadSignTargetMessageId({
        currentTargetMessageId: null,
        timelineMessages: [],
      })
    ).toBeNull();
  });
});
