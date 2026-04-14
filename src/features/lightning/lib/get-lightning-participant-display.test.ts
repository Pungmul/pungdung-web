import { describe, expect, it } from "vitest";

import { getLightningParticipantDisplay } from "./get-lightning-participant-display";

import type { LightningParticipantProfile } from "../types";

const profile = (userId: number): LightningParticipantProfile => ({
  userId,
  username: `user${userId}`,
  name: `User ${userId}`,
  profileImage: {
    id: userId,
    originalFilename: "a.jpg",
    convertedFileName: "a.jpg",
    fullFilePath: `https://example.com/${userId}.jpg`,
    fileType: "image/jpeg",
    fileSize: 1,
    createdAt: "2026-04-28T10:00:00Z",
  },
});

describe("getLightningParticipantDisplay", () => {
  it("프로필이 없으면 currentPersonNum만큼 placeholder 슬롯을 채운다", () => {
    const result = getLightningParticipantDisplay({
      participantProfiles: [],
      currentPersonNum: 3,
      maxVisible: 5,
    });
    expect(result.visibleProfiles).toEqual([]);
    expect(result.placeholderCount).toBe(3);
    expect(result.overflowCount).toBe(0);
  });

  it("인원이 maxVisible을 넘으면 overflow를 반환한다", () => {
    const result = getLightningParticipantDisplay({
      participantProfiles: [profile(1), profile(2), profile(3), profile(4), profile(5)],
      currentPersonNum: 8,
      maxVisible: 5,
    });
    expect(result.visibleProfiles).toHaveLength(5);
    expect(result.placeholderCount).toBe(0);
    expect(result.overflowCount).toBe(3);
  });

  it("프로필이 인원보다 적으면 나머지 슬롯을 placeholder로 채운다", () => {
    const result = getLightningParticipantDisplay({
      participantProfiles: [profile(1), profile(2)],
      currentPersonNum: 8,
      maxVisible: 5,
    });
    expect(result.visibleProfiles).toHaveLength(2);
    expect(result.placeholderCount).toBe(3);
    expect(result.overflowCount).toBe(3);
  });
});
