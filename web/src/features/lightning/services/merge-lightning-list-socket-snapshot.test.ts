import { describe, expect, it } from "vitest";

import {
  mergeLightningListSocketSnapshotMeetings,
  patchLightningListDataMeetings,
  selectLightningMeetingsForListSocketScope,
} from "./merge-lightning-list-socket-snapshot";

import type { LightningListData, LightningMeeting } from "../types";

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
    currentPersonNum: 1,
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

const listData = (
  overrides: Partial<LightningListData> = {}
): LightningListData => ({
  normalLightningMeetings: [],
  schoolLightningMeetings: [],
  ...overrides,
});

describe("selectLightningMeetingsForListSocketScope", () => {
  it("whole scope는 normal+school을 합친다", () => {
    const data = listData({
      normalLightningMeetings: [meeting({ id: 1 })],
      schoolLightningMeetings: [
        meeting({ id: 2, visibilityScope: "SCHOOL_ONLY" }),
      ],
    });

    expect(
      selectLightningMeetingsForListSocketScope(data, "whole")
    ).toHaveLength(2);
  });

  it("school scope는 school 목록만 반환한다", () => {
    const data = listData({
      normalLightningMeetings: [meeting({ id: 1 })],
      schoolLightningMeetings: [
        meeting({ id: 2, visibilityScope: "SCHOOL_ONLY" }),
      ],
    });

    expect(selectLightningMeetingsForListSocketScope(data, "school")).toEqual([
      data.schoolLightningMeetings[0],
    ]);
  });
});

describe("mergeLightningListSocketSnapshotMeetings", () => {
  it("참여자 payload가 없으면 existing meeting 참여자 필드를 유지한다", () => {
    const existing = meeting({
      id: 1,
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

    const [merged] = mergeLightningListSocketSnapshotMeetings({
      entries: [
        {
          meeting: meeting({
            id: 1,
            meetingName: "updated",
            currentPersonNum: 1,
          }),
          hasParticipantPayload: false,
        },
      ],
      cachedMeetings: [existing],
    });

    expect(merged?.meetingName).toBe("updated");
    expect(merged?.currentPersonNum).toBe(3);
    expect(merged?.participantProfiles).toEqual(existing.participantProfiles);
  });
});

describe("patchLightningListDataMeetings", () => {
  it("visibilityScope에 맞는 리스트를 id 기준으로 갱신한다", () => {
    const next = patchLightningListDataMeetings(
      listData({
        normalLightningMeetings: [meeting({ id: 1, meetingName: "before" })],
      }),
      [meeting({ id: 1, meetingName: "after" })]
    );

    expect(next.normalLightningMeetings[0]?.meetingName).toBe("after");
  });

  it("CLOSED 상태 delta는 normal 목록에서 제거한다", () => {
    const next = patchLightningListDataMeetings(
      listData({
        normalLightningMeetings: [meeting({ id: 1, meetingName: "before" })],
      }),
      [meeting({ id: 1, status: "CLOSED" })]
    );

    expect(next.normalLightningMeetings).toEqual([]);
  });

  it("CANCELLED 상태 delta는 school 목록에서 제거한다", () => {
    const next = patchLightningListDataMeetings(
      listData({
        schoolLightningMeetings: [
          meeting({
            id: 2,
            visibilityScope: "SCHOOL_ONLY",
            meetingName: "before",
          }),
        ],
      }),
      [
        meeting({
          id: 2,
          visibilityScope: "SCHOOL_ONLY",
          status: "CANCELLED",
        }),
      ]
    );

    expect(next.schoolLightningMeetings).toEqual([]);
  });

  it("SUCCESS 상태 delta는 목록에서 제거한다", () => {
    const next = patchLightningListDataMeetings(
      listData({
        normalLightningMeetings: [meeting({ id: 3, meetingName: "before" })],
      }),
      [meeting({ id: 3, status: "SUCCESS" })]
    );

    expect(next.normalLightningMeetings).toEqual([]);
  });
});
