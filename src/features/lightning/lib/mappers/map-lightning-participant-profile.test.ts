import { describe, expect, it } from "vitest";

import { mapLightningParticipantProfile } from "./map-lightning-participant-profile";

describe("mapLightningParticipantProfile", () => {
  it("clubName이 있으면 도메인에 포함한다", () => {
    const result = mapLightningParticipantProfile({
      userId: 1,
      username: "user@test.com",
      name: "홍길동",
      clubName: "풍물패",
      profileImage: {
        id: 1,
        originalFilename: "a.jpg",
        convertedFileName: "a.jpg",
        fullFilePath: "https://example.com/a.jpg",
        fileType: "image/jpeg",
        fileSize: 1,
        createdAt: "2026-04-28T10:00:00Z",
      },
    });
    expect(result.clubName).toBe("풍물패");
  });

  it("profileImage가 null이면 null로 매핑한다", () => {
    const result = mapLightningParticipantProfile({
      userId: 2,
      username: "user2@test.com",
      name: "김철수",
      clubName: null,
      profileImage: null,
    });
    expect(result.profileImage).toBeNull();
  });

  it("clubName이 없으면 키를 생략한다", () => {
    const result = mapLightningParticipantProfile({
      userId: 1,
      username: "user@test.com",
      name: "홍길동",
      profileImage: {
        id: 1,
        originalFilename: "a.jpg",
        convertedFileName: "a.jpg",
        fullFilePath: "https://example.com/a.jpg",
        fileType: "image/jpeg",
        fileSize: 1,
        createdAt: "2026-04-28T10:00:00Z",
      },
    });
    expect(result).not.toHaveProperty("clubName");
  });
});
