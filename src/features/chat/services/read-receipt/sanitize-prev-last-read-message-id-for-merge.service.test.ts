import { describe, expect, it } from "vitest";

import { sanitizePrevLastReadMessageIdForMerge } from "./sanitize-prev-last-read-message-id-for-merge.service";

describe("sanitizePrevLastReadMessageIdForMerge", () => {
  it("messageLogId 오염값을 타임라인 최신 id로 clamp한다", () => {
    expect(sanitizePrevLastReadMessageIdForMerge(7161, 1593)).toBe(1593);
  });

  it("정상 prev는 유지한다", () => {
    expect(sanitizePrevLastReadMessageIdForMerge(1580, 1593)).toBe(1580);
  });

  it("latest가 없으면 prev를 그대로 둔다", () => {
    expect(sanitizePrevLastReadMessageIdForMerge(7161, null)).toBe(7161);
  });
});
