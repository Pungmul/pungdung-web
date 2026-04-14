import { describe, expect, it } from "vitest";

import { mergeParticipationMeetingParticipantsFromSearch } from "./merge-participation-meeting-participants-from-search";

import type {
  LightningMeeting,
  LightningParticipantProfile,
} from "../types";

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
    currentPersonNum: restOverrides.currentPersonNum ?? 0,
    participantProfiles: restOverrides.participantProfiles ?? [],
    lightningMeetingParticipantList: [],
    instrumentAssignmentList: [],
    status: "RECRUITING",
    notificationSent: false,
    visibilityScope: "ALL",
    createdAt: "2026-04-28T09:00:00Z",
    updatedAt: "2026-04-28T09:00:00Z",
    ...restOverrides,
  } as LightningMeeting;
};

describe("mergeParticipationMeetingParticipantsFromSearch", () => {
  it("참여 모임이 없으면 null을 반환한다", () => {
    expect(
      mergeParticipationMeetingParticipantsFromSearch(null, [])
    ).toBeNull();
  });

  it("search 목록에 동일 id가 없으면 참여 모임을 그대로 반환한다", () => {
    const participation = meeting({ id: 1, participantProfiles: [] });

    expect(
      mergeParticipationMeetingParticipantsFromSearch(participation, [
        meeting({ id: 2, participantProfiles: [profile(2)] }),
      ])
    ).toBe(participation);
  });

  it("참여 모임 프로필이 비어 있고 search에 있으면 search 프로필로 보완한다", () => {
    const participation = meeting({
      id: 1,
      participantProfiles: [],
      currentPersonNum: 0,
    });
    const fromSearch = meeting({
      id: 1,
      participantProfiles: [profile(1), profile(2)],
      currentPersonNum: 2,
    });

    expect(
      mergeParticipationMeetingParticipantsFromSearch(participation, [
        fromSearch,
      ])
    ).toEqual({
      ...participation,
      participantProfiles: fromSearch.participantProfiles,
      currentPersonNum: 2,
    });
  });

  it("참여 모임에 이미 프로필이 있으면 search 데이터로 덮어쓰지 않는다", () => {
    const participation = meeting({
      id: 1,
      participantProfiles: [profile(1)],
      currentPersonNum: 1,
    });
    const fromSearch = meeting({
      id: 1,
      participantProfiles: [profile(2), profile(3)],
      currentPersonNum: 2,
    });

    expect(
      mergeParticipationMeetingParticipantsFromSearch(participation, [
        fromSearch,
      ])
    ).toBe(participation);
  });
});
