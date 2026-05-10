import { describe, expect, it } from "vitest";

import { isRoomInfoReadyForEntrySnapshot } from "./is-room-info-ready-for-entry-snapshot.service";

describe("isRoomInfoReadyForEntrySnapshot", () => {
  it("fetch가 끝나면 true", () => {
    expect(
      isRoomInfoReadyForEntrySnapshot({
        isSuccess: true,
        isFetching: false,
      })
    ).toBe(true);
  });

  it("refetch 중이면 false", () => {
    expect(
      isRoomInfoReadyForEntrySnapshot({
        isSuccess: true,
        isFetching: true,
      })
    ).toBe(false);
  });

  it("초기 fetch 전(isSuccess=false)이면 false", () => {
    expect(
      isRoomInfoReadyForEntrySnapshot({
        isSuccess: false,
        isFetching: false,
      })
    ).toBe(false);
  });
});
