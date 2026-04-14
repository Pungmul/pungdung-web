import { describe, expect, it } from "vitest";

import type { fetchUserParticipationStatusResponse } from "../../api/client/dto.schema";

import { mapUserParticipationStatus } from "./map-user-participation-status";

const baseResponse: fetchUserParticipationStatusResponse = {
  participant: true,
  isOrganizer: false,
  chatRoomUUID: "chat-room-uuid",
  participantProfiles: [],
  lightningMeeting: {
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
    longitude: 127,
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
  },
};

describe("mapUserParticipationStatus", () => {
  it("최상위 participantProfiles를 participationData.participantProfiles로 유지한다", () => {
    const result = mapUserParticipationStatus({
      ...baseResponse,
      participantProfiles: [
        {
          userId: 10,
          username: "user@pungmul.com",
          name: "홍길동",
          clubName: "풍물패",
          profileImage: null,
        },
      ],
    });

    expect(result.participantProfiles).toHaveLength(1);
    expect(result.participantProfiles[0]?.name).toBe("홍길동");
  });

  it("meeting 내부 participantProfiles는 mapLightningMeeting 결과를 유지한다", () => {
    const result = mapUserParticipationStatus({
      ...baseResponse,
      participantProfiles: [],
      lightningMeeting: {
        ...baseResponse.lightningMeeting!,
        participantProfiles: [
          {
            userId: 11,
            username: "inner@pungmul.com",
            name: "내부참여자",
            clubName: "풍물패",
            profileImage: null,
          },
        ],
      },
    });

    expect(result.participantProfiles).toEqual([]);
    expect(result.lightningMeeting?.participantProfiles).toHaveLength(1);
    expect(result.lightningMeeting?.participantProfiles[0]?.name).toBe(
      "내부참여자"
    );
  });
});
