import { describe, expect, it } from "vitest";

import { shouldRefetchParticipationStatusFromSocket } from "./should-refetch-participation-status-from-socket";

import type { LightningMeeting, UserParticipationData } from "../types";

const meeting = (
  overrides: Partial<LightningMeeting> & Pick<LightningMeeting, "id">
): LightningMeeting => {
  const { id, ...restOverrides } = overrides;

  return {
    id,
    meetingName: "test",
    recruitmentEndTime: "2026-04-28T10:00:00Z",
    startTime: "2026-04-28T11:00:00Z",
    endTime: "2026-04-28T12:00:00Z",
    minPersonNum: 2,
    maxPersonNum: 10,
    organizerId: 1,
    meetingType: "FREE",
    latitude: 0,
    longitude: 0,
    buildingName: "building",
    locationDetail: "detail",
    tags: [],
    currentPersonNum: 2,
    participantProfiles: [],
    lightningMeetingParticipantList: [],
    instrumentAssignmentList: [],
    status: "OPEN",
    notificationSent: false,
    visibilityScope: "ALL",
    createdAt: "2026-04-28T09:00:00Z",
    updatedAt: "2026-04-28T09:00:00Z",
    ...restOverrides,
  };
};

const participationStatus = (
  overrides: Partial<UserParticipationData> = {}
): UserParticipationData => ({
  participant: true,
  isOrganizer: false,
  chatRoomUUID: "chat-room",
  lightningMeeting: meeting({ id: 1 }),
  participantProfiles: [],
  ...overrides,
});

describe("shouldRefetchParticipationStatusFromSocket", () => {
  it("참여 중 번개가 소켓 delta에 포함되면 refetch한다", () => {
    expect(
      shouldRefetchParticipationStatusFromSocket({
        participationStatus: participationStatus(),
        scope: "whole",
        changedMeetings: [meeting({ id: 1 }), meeting({ id: 2 })],
      })
    ).toEqual({ shouldRefetch: true, meetingId: 1 });
  });

  it("참여 중이 아니면 refetch하지 않는다", () => {
    expect(
      shouldRefetchParticipationStatusFromSocket({
        participationStatus: participationStatus({
          participant: false,
          lightningMeeting: null,
        }),
        scope: "whole",
        changedMeetings: [meeting({ id: 1 })],
      })
    ).toEqual({ shouldRefetch: false, reason: "not_participant" });
  });

  it("스코프가 다르면 refetch하지 않는다", () => {
    expect(
      shouldRefetchParticipationStatusFromSocket({
        participationStatus: participationStatus({
          lightningMeeting: meeting({ id: 1, visibilityScope: "SCHOOL_ONLY" }),
        }),
        scope: "whole",
        changedMeetings: [meeting({ id: 1, visibilityScope: "SCHOOL_ONLY" })],
      })
    ).toEqual({
      shouldRefetch: false,
      reason: "scope_mismatch",
      meetingId: 1,
    });
  });

  it("소켓 delta에 참여 중 번개가 없으면 refetch하지 않는다", () => {
    expect(
      shouldRefetchParticipationStatusFromSocket({
        participationStatus: participationStatus(),
        scope: "whole",
        changedMeetings: [meeting({ id: 99 })],
      })
    ).toEqual({
      shouldRefetch: false,
      reason: "changed_meeting_not_participating",
      meetingId: 1,
    });
  });
});
