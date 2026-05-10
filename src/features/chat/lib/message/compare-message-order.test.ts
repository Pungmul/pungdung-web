import { describe, expect, it } from "vitest";

import {
  compareMessagesBySequence,
  sortMessagesNewestFirst,
  sortMessagesOldestFirst,
} from "./compare-message-order";

type TestMessage = {
  id: number | string;
  createdAt: string;
};

const message = (id: number | string, createdAt: string): TestMessage => ({
  id,
  createdAt,
});

describe("compare-message-order", () => {
  it("ID 오름차순/내림차순 래퍼가 동작한다", () => {
    const messages = [
      message(30, "2026-01-01T00:00:30.000Z"),
      message(10, "2026-01-01T00:00:10.000Z"),
      message(20, "2026-01-01T00:00:20.000Z"),
    ];

    expect(sortMessagesOldestFirst(messages).map((item) => item.id)).toEqual([
      10, 20, 30,
    ]);
    expect(sortMessagesNewestFirst(messages).map((item) => item.id)).toEqual([
      30, 20, 10,
    ]);
  });

  it("숫자 ID가 다르면 createdAt이 반대여도 ID가 우선한다", () => {
    const left = message(100, "2026-01-01T00:10:00.000Z");
    const right = message(101, "2026-01-01T00:00:00.000Z");

    expect(compareMessagesBySequence(left, right)).toBeLessThan(0);
  });

  it("동일한 숫자 ID는 createdAt으로 tie-break한다", () => {
    const earlier = message(100, "2026-01-01T00:00:00.000Z");
    const later = message(100, "2026-01-01T00:10:00.000Z");

    expect(compareMessagesBySequence(earlier, later)).toBeLessThan(0);
  });

  it("동일 숫자 ID + 동일 createdAt이면 String(id)로 tie-break한다", () => {
    const left = message("001", "2026-01-01T00:00:00.000Z");
    const right = message(1, "2026-01-01T00:00:00.000Z");

    expect(compareMessagesBySequence(left, right)).toBeLessThan(0);
  });

  it("둘 다 비숫자 ID면 createdAt 후 String(id) 순서로 비교한다", () => {
    const newerAt = message("a-2", "2026-01-01T00:10:00.000Z");
    const olderAt = message("z-1", "2026-01-01T00:00:00.000Z");
    const sameTimeA = message("a-1", "2026-01-01T00:20:00.000Z");
    const sameTimeB = message("b-1", "2026-01-01T00:20:00.000Z");

    expect(compareMessagesBySequence(newerAt, olderAt)).toBeGreaterThan(0);
    expect(compareMessagesBySequence(sameTimeA, sameTimeB)).toBeLessThan(0);
  });

  it("한쪽만 숫자 ID여도 createdAt 비교로 폴백한다", () => {
    const numeric = message(100, "2026-01-01T00:10:00.000Z");
    const nonNumeric = message("pending-1", "2026-01-01T00:00:00.000Z");

    expect(compareMessagesBySequence(numeric, nonNumeric)).toBeGreaterThan(0);
  });

  it("createdAt이 유효하지 않으면 String(id) 비교로 폴백한다", () => {
    const invalidA = message("x-10", "invalid-date");
    const invalidB = message("x-2", "also-invalid");

    expect(compareMessagesBySequence(invalidA, invalidB)).toBeLessThan(0);
  });
});
