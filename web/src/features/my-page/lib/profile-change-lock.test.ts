import { describe, expect, it } from "vitest";

import {
  formatProfileChangeLockedAt,
  resolveProfileChangeLocks,
} from "./profile-change-lock";

describe("profile-change-lock", () => {
  it("마지막 수정일이 6개월 이내면 잠금으로 본다", () => {
    const result = resolveProfileChangeLocks({
      updatedAt: "2026-07-06",
      clubNameChangedAt: "2026-05-01T10:23:00",
      clubIdChangedAt: null,
    });

    expect(result.isClubNameLocked).toBe(true);
    expect(result.isClubLocked).toBe(false);
  });

  it("6개월이 지난 필드는 잠금 해제한다", () => {
    const result = resolveProfileChangeLocks({
      updatedAt: "2026-07-06",
      clubNameChangedAt: "2025-12-01T10:23:00",
      clubIdChangedAt: "2025-12-01T10:23:00",
    });

    expect(result.isClubNameLocked).toBe(false);
    expect(result.isClubLocked).toBe(false);
  });

  it("경고 문구용 마지막 수정일을 YYYY.MM.DD로 포맷한다", () => {
    expect(formatProfileChangeLockedAt("2026-05-01T10:23:00")).toBe(
      "2026.05.01"
    );
  });
});
