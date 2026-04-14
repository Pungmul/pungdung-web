import { describe, expect, it } from "vitest";

import { parseLightningSocketMeetings } from "./parse-lightning-socket-meetings";

const validMeeting = {
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
  currentPersonNum: 2,
};

describe("parseLightningSocketMeetings", () => {
  it("유효한 LIGHTNING_MEETING 메시지를 도메인 목록으로 변환한다", () => {
    const result = parseLightningSocketMeetings({
      domainType: "LIGHTNING_MEETING",
      content: [validMeeting],
    });
    expect(result).toHaveLength(1);
    expect(result?.[0]?.currentPersonNum).toBe(2);
    expect(result?.[0]?.participantProfiles).toEqual([]);
  });

  it("domainType이 다르거나 content가 배열이 아니면 null을 반환한다", () => {
    expect(parseLightningSocketMeetings({ domainType: "OTHER" })).toBeNull();
    expect(
      parseLightningSocketMeetings({
        domainType: "LIGHTNING_MEETING",
        content: "not-array",
      })
    ).toBeNull();
  });
});
