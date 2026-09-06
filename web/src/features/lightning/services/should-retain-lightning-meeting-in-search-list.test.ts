import { describe, expect, it } from "vitest";

import { LIGHTNING_STATUS } from "../constants";

import { shouldRetainLightningMeetingInSearchList } from "./should-retain-lightning-meeting-in-search-list";

describe("shouldRetainLightningMeetingInSearchList", () => {
  it("OPEN과 READY는 목록에 남긴다", () => {
    expect(
      shouldRetainLightningMeetingInSearchList(LIGHTNING_STATUS.OPEN)
    ).toBe(true);
    expect(
      shouldRetainLightningMeetingInSearchList(LIGHTNING_STATUS.READY)
    ).toBe(true);
  });

  it("SUCCESS, END, CANCELLED는 목록에서 뺀다", () => {
    expect(
      shouldRetainLightningMeetingInSearchList(LIGHTNING_STATUS.SUCCESS)
    ).toBe(false);
    expect(
      shouldRetainLightningMeetingInSearchList(LIGHTNING_STATUS.END)
    ).toBe(false);
    expect(
      shouldRetainLightningMeetingInSearchList(LIGHTNING_STATUS.CANCELLED)
    ).toBe(false);
  });
});
