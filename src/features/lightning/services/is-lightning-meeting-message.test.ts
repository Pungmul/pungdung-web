import { describe, expect, it } from "vitest";

import { isLightningMeetingMessage } from "./is-lightning-meeting-message";

describe("isLightningMeetingMessage", () => {
  it("domainType이 LIGHTNING_MEETING이면 true", () => {
    expect(
      isLightningMeetingMessage({
        domainType: "LIGHTNING_MEETING",
        content: [],
      })
    ).toBe(true);
  });

  it("null·undefined·원시값이면 false", () => {
    expect(isLightningMeetingMessage(null)).toBe(false);
    expect(isLightningMeetingMessage(undefined)).toBe(false);
    expect(isLightningMeetingMessage("x")).toBe(false);
  });

  it("객체지만 domainType이 다르면 false", () => {
    expect(isLightningMeetingMessage({ domainType: "OTHER" })).toBe(false);
  });
});
