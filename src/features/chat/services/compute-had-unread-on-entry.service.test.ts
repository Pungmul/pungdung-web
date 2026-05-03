import { describe, expect, it } from "vitest";

import { computeHadUnreadOnEntry } from "./compute-had-unread-on-entry.service";

describe("computeHadUnreadOnEntry", () => {
  it("진입 시 최신까지 읽었으면 false", () => {
    expect(computeHadUnreadOnEntry(1135, 1135)).toBe(false);
    expect(computeHadUnreadOnEntry(1135, 1133)).toBe(false);
  });

  it("진입 시 미확인 메시지가 있으면 true", () => {
    expect(computeHadUnreadOnEntry(1133, 1135)).toBe(true);
  });

  it("메시지가 없으면 false", () => {
    expect(computeHadUnreadOnEntry(1133, null)).toBe(false);
  });

  it("메시지 목록이 아직 비었어도 unread 힌트가 있으면 true", () => {
    expect(
      computeHadUnreadOnEntry(1135, 1135, { entryUnreadCountHint: 3 })
    ).toBe(true);
  });
});
