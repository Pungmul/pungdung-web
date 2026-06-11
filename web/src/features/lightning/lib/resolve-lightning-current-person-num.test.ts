import { describe, expect, it } from "vitest";

import type { LightningMeetingDto } from "../api/client/dto.schema";

import { resolveLightningCurrentPersonNum } from "./resolve-lightning-current-person-num";

const baseDto = {
  id: 1,
  meetingName: "모임",
  recruitmentEndTime: "2026-04-28T12:00:00Z",
  startTime: "2026-04-28T13:00:00Z",
  endTime: "2026-04-28T15:00:00Z",
  minPersonNum: 2,
  maxPersonNum: 10,
  organizerId: 99,
  meetingType: "FREE",
  latitude: 37.5,
  longitude: 127.0,
  buildingName: "건물",
  locationDetail: "상세",
  tags: [],
  participantProfiles: [],
  lightningMeetingParticipantList: [],
  instrumentAssignmentList: [],
  status: "OPEN",
  notificationSent: false,
  visibilityScope: "ALL",
  createdAt: "2026-04-28T10:00:00Z",
  updatedAt: "2026-04-28T10:00:00Z",
} satisfies LightningMeetingDto;

describe("resolveLightningCurrentPersonNum", () => {
  it("서버 currentPersonNum을 우선한다", () => {
    expect(
      resolveLightningCurrentPersonNum({ ...baseDto, currentPersonNum: 7 })
    ).toBe(7);
  });

  it("currentPersonNum이 없으면 participantProfiles 길이를 쓴다", () => {
    expect(
      resolveLightningCurrentPersonNum({
        ...baseDto,
        participantProfiles: [
          {
            userId: 1,
            username: "a",
            name: "A",
            profileImage: {
              id: 1,
              originalFilename: "a.jpg",
              convertedFileName: "a.jpg",
              fullFilePath: "https://example.com/a.jpg",
              fileType: "image/jpeg",
              fileSize: 1,
              createdAt: "2026-04-28T10:00:00Z",
            },
          },
        ],
      })
    ).toBe(1);
  });

  it("둘 다 없으면 lightningMeetingParticipantList.length + 1을 쓴다", () => {
    expect(
      resolveLightningCurrentPersonNum({
        ...baseDto,
        lightningMeetingParticipantList: [{}, {}],
      })
    ).toBe(3);
  });
});
