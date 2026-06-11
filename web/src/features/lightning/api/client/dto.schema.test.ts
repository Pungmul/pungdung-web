import { describe, expect, it } from "vitest";

import {
  type CreateLightningRequest,
  type LightningMeetingDto,
  cancelLightningMeetingBodySchema,
  createLightningRequestSchema,
  deleteLightningMeetingRequestSchema,
  exitLightningMeetingRequestSchema,
  fetchLightningDataResponseSchema,
  fetchNearLightningResponseSchema,
  fetchUserLocationResponseSchema,
  fetchUserParticipationStatusResponseSchema,
  joinLightningMeetingRequestSchema,
  lightningMeetingSchema,
  voidResponseSchema,
} from "./dto.schema";

/** DTO 픽스처 — `satisfies`로 스키마 타입과 불일치 시 컴파일 단계에서 걸린다 */
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
  tags: ["태그"],
  participantProfiles: [],
  lightningMeetingParticipantList: [],
  instrumentAssignmentList: [],
  status: "OPEN",
  notificationSent: false,
  visibilityScope: "ALL",
  createdAt: "2026-04-28T10:00:00Z",
  updatedAt: "2026-04-28T10:00:00Z",
} satisfies LightningMeetingDto;

const createRequestBase = {
  meetingName: "제목",
  recruitmentEndTime: "2026-04-28T11:00:00Z",
  startTime: "2026-04-28T12:00:00Z",
  endTime: "2026-04-28T14:00:00Z",
  minPersonNum: 2,
  maxPersonNum: 5,
  latitude: 1,
  longitude: 2,
  buildingName: "b",
  locationDetail: "d",
  visibilityScope: "ALL",
  tags: [],
} satisfies Omit<CreateLightningRequest, "meetingType">;

describe("lightningMeetingSchema", () => {
  it("유효한 모임 객체를 통과시킨다", () => {
    const parsed = lightningMeetingSchema.safeParse(validMeeting);
    expect(parsed.success).toBe(true);
  });

  it("meetingType이 허용 목록이 아니면 실패한다", () => {
    const parsed = lightningMeetingSchema.safeParse({
      ...validMeeting,
      meetingType: "INVALID",
    });
    expect(parsed.success).toBe(false);
  });

  it("status가 허용 목록이 아니면 실패한다", () => {
    const parsed = lightningMeetingSchema.safeParse({
      ...validMeeting,
      status: "UNKNOWN",
    });
    expect(parsed.success).toBe(false);
  });

  it("participantProfiles의 profileImage가 null이어도 통과시킨다", () => {
    const parsed = lightningMeetingSchema.safeParse({
      ...validMeeting,
      participantProfiles: [
        {
          userId: 1,
          username: "user@test.com",
          name: "테스트",
          clubName: null,
          profileImage: null,
        },
      ],
    });
    expect(parsed.success).toBe(true);
  });

  it("visibilityScope가 허용 목록이 아니면 실패한다", () => {
    const parsed = lightningMeetingSchema.safeParse({
      ...validMeeting,
      visibilityScope: "PRIVATE",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("fetchLightningDataResponseSchema", () => {
  it("빈 리스트도 통과시킨다", () => {
    const parsed = fetchLightningDataResponseSchema.safeParse({
      normalLightningMeetings: [],
      schoolLightningMeetings: [],
    });
    expect(parsed.success).toBe(true);
  });
});

describe("fetchUserParticipationStatusResponseSchema", () => {
  it("lightningMeeting이 null이어도 통과시킨다", () => {
    const parsed = fetchUserParticipationStatusResponseSchema.safeParse({
      participant: false,
      isOrganizer: null,
      chatRoomUUID: null,
      lightningMeeting: null,
    });
    expect(parsed.success).toBe(true);
  });

  it("participantProfiles가 null이면 빈 배열로 정규화한다", () => {
    const parsed = fetchUserParticipationStatusResponseSchema.safeParse({
      participant: false,
      isOrganizer: null,
      chatRoomUUID: null,
      lightningMeeting: null,
      participantProfiles: null,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.participantProfiles).toEqual([]);
    }
  });
});

describe("fetchNearLightningResponseSchema", () => {
  it("lightningMeetingList 키가 없으면 빈 배열 기본값이 적용된다", () => {
    const parsed = fetchNearLightningResponseSchema.safeParse({});
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.lightningMeetingList).toEqual([]);
    }
  });
});

describe("createLightningRequestSchema", () => {
  it("meetingType FREE 요청을 통과시킨다", () => {
    const parsed = createLightningRequestSchema.safeParse({
      ...createRequestBase,
      meetingType: "FREE",
    });
    expect(parsed.success).toBe(true);
  });

  it("meetingType PAN 요청을 통과시킨다", () => {
    const parsed = createLightningRequestSchema.safeParse({
      ...createRequestBase,
      meetingType: "PAN",
    });
    expect(parsed.success).toBe(true);
  });

  it("meetingType이 FREE/PAN이 아니면 실패한다", () => {
    const parsed = createLightningRequestSchema.safeParse({
      ...createRequestBase,
      meetingType: "OTHER",
    });
    expect(parsed.success).toBe(false);
  });

  it("FREE 분기에서 meetingName이 없으면 실패한다", () => {
    const { meetingName: _m, ...rest } = {
      ...createRequestBase,
      meetingType: "FREE" as const,
    };
    const parsed = createLightningRequestSchema.safeParse(rest);
    expect(parsed.success).toBe(false);
  });
});

describe("fetchUserLocationResponseSchema", () => {
  it("추가 키가 있어도 latitude·longitude만 검증하고 통과시킨다", () => {
    const parsed = fetchUserLocationResponseSchema.safeParse({
      latitude: 10,
      longitude: 20,
      extra: "ignored",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.latitude).toBe(10);
      expect(parsed.data.longitude).toBe(20);
    }
  });

  it("latitude가 없으면 실패한다", () => {
    const parsed = fetchUserLocationResponseSchema.safeParse({
      longitude: 20,
    });
    expect(parsed.success).toBe(false);
  });
});

describe("voidResponseSchema", () => {
  it("임의 입력을 파싱하면 undefined로 변환된다", () => {
    const parsed = voidResponseSchema.safeParse({ any: "value" });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toBeUndefined();
    }
  });
});

describe("요청 바디 스키마 샘플", () => {
  it("joinLightningMeetingRequestSchema가 meetingId를 통과시킨다", () => {
    expect(
      joinLightningMeetingRequestSchema.safeParse({ meetingId: 1 }).success
    ).toBe(true);
  });

  it("exitLightningMeetingRequestSchema가 lightningMeetingId를 통과시킨다", () => {
    expect(
      exitLightningMeetingRequestSchema.safeParse({ lightningMeetingId: 2 })
        .success
    ).toBe(true);
  });

  it("deleteLightningMeetingRequestSchema가 lightningMeetingId를 통과시킨다", () => {
    expect(
      deleteLightningMeetingRequestSchema.safeParse({ lightningMeetingId: 3 })
        .success
    ).toBe(true);
  });

  it("cancelLightningMeetingBodySchema가 meetingId를 통과시킨다", () => {
    expect(
      cancelLightningMeetingBodySchema.safeParse({ meetingId: 4 }).success
    ).toBe(true);
  });
});

describe("nearLightningItemSchema (통합)", () => {
  it("fetchNearLightningResponseSchema에 항목 배열이 있으면 통과시킨다", () => {
    const parsed = fetchNearLightningResponseSchema.safeParse({
      lightningMeetingList: [
        {
          distanceInMeters: 100,
          organizerName: "주최",
          lightningMeeting: validMeeting,
        },
      ],
    });
    expect(parsed.success).toBe(true);
  });
});
