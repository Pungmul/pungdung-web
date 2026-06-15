import { describe, expect, it } from "vitest";

import { hasLightningSocketParticipantPayload } from "./has-lightning-socket-participant-payload";
import { mergeLightningMeetingSocketSnapshot } from "./merge-lightning-meeting-socket-snapshot";

import type { LightningMeeting } from "../types";

const baseMeeting = (overrides: Partial<LightningMeeting> = {}): LightningMeeting => ({
  id: 1,
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
  currentPersonNum: 1,
  participantProfiles: [],
  lightningMeetingParticipantList: [],
  instrumentAssignmentList: [],
  status: "OPEN",
  notificationSent: false,
  visibilityScope: "ALL",
  createdAt: "2026-04-28T09:00:00Z",
  updatedAt: "2026-04-28T09:00:00Z",
  ...overrides,
});

describe("hasLightningSocketParticipantPayload", () => {
  it("currentPersonNum이 있으면 true다", () => {
    expect(
      hasLightningSocketParticipantPayload({
        ...baseMeeting(),
        currentPersonNum: 3,
      } as never)
    ).toBe(true);
  });

  it("participantProfiles나 participant list가 있으면 true다", () => {
    expect(
      hasLightningSocketParticipantPayload({
        ...baseMeeting(),
        participantProfiles: [
          {
            userId: 1,
            username: "user1",
            name: "User 1",
            clubName: "club",
            profileImage: null,
          },
        ],
      } as never)
    ).toBe(true);
  });

  it("참여자 필드가 모두 비어 있으면 false다", () => {
    const { currentPersonNum: _currentPersonNum, ...dtoWithoutCount } =
      baseMeeting();

    expect(
      hasLightningSocketParticipantPayload(dtoWithoutCount as never)
    ).toBe(false);
  });
});

describe("mergeLightningMeetingSocketSnapshot", () => {
  it("참여자 payload가 없으면 기존 참여자 필드를 유지한다", () => {
    const existing = baseMeeting({
      currentPersonNum: 3,
      participantProfiles: [
        {
          userId: 2,
          username: "user2",
          name: "User 2",
          clubName: "club",
          profileImage: null,
        },
      ],
    });
    const incoming = baseMeeting({
      meetingName: "updated",
      currentPersonNum: 1,
      participantProfiles: [],
    });

    expect(
      mergeLightningMeetingSocketSnapshot(incoming, existing, false)
    ).toEqual({
      ...incoming,
      currentPersonNum: 3,
      participantProfiles: existing.participantProfiles,
      lightningMeetingParticipantList: existing.lightningMeetingParticipantList,
    });
  });
});
