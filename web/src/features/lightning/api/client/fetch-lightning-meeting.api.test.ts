import { beforeEach, describe, expect, it, vi } from "vitest";

import type { LightningMeetingDto } from "./dto.schema";

const mocks = vi.hoisted(() => ({
  clientApiRequest: vi.fn(),
}));

vi.mock("@/core/api/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/core/api/client")>();
  return {
    ...actual,
    clientApiRequest: mocks.clientApiRequest,
  };
});

import { fetchLightningMeeting } from "./fetch-lightning-meeting.api";

const meetingDto = {
  id: 7,
  meetingName: "호두마루님의 모임",
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
  tags: ["태그"],
  currentPersonNum: 4,
  participantProfiles: [],
  lightningMeetingParticipantList: [],
  instrumentAssignmentList: [],
  status: "OPEN",
  chatRoomUUID: "room-1",
  notificationSent: false,
  visibilityScope: "ALL",
  createdAt: "2026-04-28T10:00:00Z",
  updatedAt: "2026-04-28T10:00:00Z",
} satisfies LightningMeetingDto;

describe("fetchLightningMeeting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("단건 응답을 LightningMeeting으로 반환한다", async () => {
    mocks.clientApiRequest.mockResolvedValueOnce(meetingDto);

    const result = await fetchLightningMeeting(7);

    expect(mocks.clientApiRequest).toHaveBeenCalledWith({
      url: "/api/lightning/7",
      responseSchema: expect.anything(),
    });
    expect(result.id).toBe(7);
    expect(result.meetingName).toBe("호두마루님의 모임");
    expect(result.chatRoomUUID).toBe("room-1");
    expect(result.currentPersonNum).toBe(4);
  });
});
