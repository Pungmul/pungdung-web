import { describe, expect, it } from "vitest";

import { formatLightningParticipantSubtitle } from "./format-lightning-participant-subtitle";

import type { LightningParticipantProfile } from "../types";

const profile = (
  overrides: Partial<LightningParticipantProfile> = {}
): LightningParticipantProfile => ({
  userId: 1,
  username: "user@pungdung.com",
  name: "홍길동",
  clubName: null,
  groupName: null,
  profileImage: null,
  ...overrides,
});

describe("formatLightningParticipantSubtitle", () => {
  it("동아리가 있으면 패명 · 동아리 형식으로 반환한다", () => {
    expect(
      formatLightningParticipantSubtitle(
        profile({
          clubName: "풍덩패",
          groupName: "서울대 풍물패",
          username: "user@pungdung.com",
        })
      )
    ).toBe("풍덩패 · 서울대 풍물패");
  });

  it("동아리만 있고 패명이 없으면 동아리명만 반환한다", () => {
    expect(
      formatLightningParticipantSubtitle(
        profile({ groupName: "서울대 풍물패", username: "user@pungdung.com" })
      )
    ).toBe("서울대 풍물패");
  });

  it("동아리가 없으면 이메일만 반환한다", () => {
    expect(
      formatLightningParticipantSubtitle(
        profile({ username: "user@pungdung.com" })
      )
    ).toBe("user@pungdung.com");
  });

  it("패명만 있고 동아리가 없으면 이메일을 반환한다", () => {
    expect(
      formatLightningParticipantSubtitle(
        profile({ clubName: "풍덩패", username: "user@pungdung.com" })
      )
    ).toBe("user@pungdung.com");
  });

  it("공백만 있는 동아리명은 이메일 fallback으로 처리한다", () => {
    expect(
      formatLightningParticipantSubtitle(
        profile({ groupName: "   ", username: "user@pungdung.com" })
      )
    ).toBe("user@pungdung.com");
  });
});
