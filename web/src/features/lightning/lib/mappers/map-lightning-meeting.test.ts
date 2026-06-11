import { describe, expect, it } from "vitest";

import type { LightningMeetingDto } from "../../api/client/dto.schema";

import { mapLightningMeeting } from "./map-lightning-meeting";

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

describe("mapLightningMeeting", () => {
  it("tags가 null이면 빈 배열로 정규화한다", () => {
    const dto: LightningMeetingDto = { ...baseDto, tags: null };
    const result = mapLightningMeeting(dto);
    expect(result.tags).toEqual([]);
  });

  it("tags가 배열이면 그대로 전달한다", () => {
    const dto: LightningMeetingDto = { ...baseDto, tags: ["a", "b"] };
    const result = mapLightningMeeting(dto);
    expect(result.tags).toEqual(["a", "b"]);
  });

  it("나머지 필드는 DTO와 동일하게 옮긴다", () => {
    const dto: LightningMeetingDto = baseDto;
    const result = mapLightningMeeting(dto);
    expect(result.id).toBe(dto.id);
    expect(result.meetingName).toBe(dto.meetingName);
    expect(result.meetingType).toBe(dto.meetingType);
    expect(result.lightningMeetingParticipantList).toBe(
      dto.lightningMeetingParticipantList
    );
  });

  it("currentPersonNum·participantProfiles를 매핑한다", () => {
    const dto: LightningMeetingDto = {
      ...baseDto,
      currentPersonNum: 3,
      participantProfiles: [
        {
          userId: 10,
          username: "user@pungdung.com",
          name: "홍길동",
          clubName: "풍물패",
          profileImage: {
            id: 5,
            originalFilename: "a.jpg",
            convertedFileName: "a.jpg",
            fullFilePath: "https://example.com/a.jpg",
            fileType: "image/jpeg",
            fileSize: 100,
            createdAt: "2026-04-28T10:00:00Z",
          },
        },
      ],
    };
    const result = mapLightningMeeting(dto);
    expect(result.currentPersonNum).toBe(3);
    expect(result.participantProfiles).toHaveLength(1);
    expect(result.participantProfiles[0]?.name).toBe("홍길동");
  });

  it("currentPersonNum이 없으면 participantProfiles 길이로 추정한다", () => {
    const dto: LightningMeetingDto = {
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
        {
          userId: 2,
          username: "b",
          name: "B",
          profileImage: {
            id: 2,
            originalFilename: "b.jpg",
            convertedFileName: "b.jpg",
            fullFilePath: "https://example.com/b.jpg",
            fileType: "image/jpeg",
            fileSize: 1,
            createdAt: "2026-04-28T10:00:00Z",
          },
        },
      ],
    };
    expect(mapLightningMeeting(dto).currentPersonNum).toBe(2);
  });
});
