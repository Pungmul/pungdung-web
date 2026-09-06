import dayjs from "dayjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LIGHTNING_STATUS } from "../constants";
import type { LightningMeeting } from "../types";

import { getLightningParticipationTimeDisplay } from "./get-lightning-participation-time-display";

const baseMeeting: LightningMeeting = {
  id: 1,
  meetingName: "테스트 번개",
  recruitmentEndTime: "2026-04-28T12:00:00Z",
  startTime: "2026-04-28T13:00:00Z",
  endTime: "2026-04-28T15:00:00Z",
  minPersonNum: 2,
  maxPersonNum: 10,
  organizerId: 1,
  meetingType: "FREE",
  latitude: 0,
  longitude: 0,
  buildingName: "건물",
  locationDetail: "상세",
  tags: [],
  currentPersonNum: 3,
  participantProfiles: [],
  lightningMeetingParticipantList: [],
  instrumentAssignmentList: [],
  status: LIGHTNING_STATUS.OPEN,
  notificationSent: false,
  visibilityScope: "ALL",
  createdAt: "2026-04-28T10:00:00Z",
  updatedAt: "2026-04-28T10:00:00Z",
};

describe("getLightningParticipationTimeDisplay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-28T11:30:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("모집 중이면 모집중 상태와 남은 분·초 마감 텍스트를 반환한다", () => {
    const result = getLightningParticipationTimeDisplay(baseMeeting);

    expect(result.statusLabel).toBe("모집중");
    expect(result.subText).toBe("30분 남음");
    expect(result.detailRemainingText).toBe("30분 0초 뒤 마감");
  });

  it("모집 마감 시각이 지나도 status가 OPEN이면 모집중을 유지한다", () => {
    vi.setSystemTime(new Date("2026-04-28T12:30:00Z"));

    const result = getLightningParticipationTimeDisplay(baseMeeting);

    expect(result.statusLabel).toBe("모집중");
    expect(result.subText).toBe("30분 뒤 시작");
    expect(result.detailRemainingText).toBe("30분 뒤 시작");
  });

  it("READY면 시각과 무관하게 준비완료이고 모집 남은 시간을 보여준다", () => {
    const result = getLightningParticipationTimeDisplay({
      ...baseMeeting,
      status: LIGHTNING_STATUS.READY,
    });

    expect(result.statusLabel).toBe("준비완료");
    expect(result.subText).toBe("30분 남음");
    expect(result.detailRemainingText).toBe("30분 0초 뒤 마감");
  });

  it("SUCCESS면 모집완료이고 시작까지 남은 시간을 보여준다", () => {
    const result = getLightningParticipationTimeDisplay({
      ...baseMeeting,
      status: LIGHTNING_STATUS.SUCCESS,
    });

    expect(result.statusLabel).toBe("모집완료");
    expect(result.subText).toBe("90분 뒤 시작");
    expect(result.detailRemainingText).toBe("90분 뒤 시작");
  });

  it("시작 후에는 status 라벨을 유지하고 종료까지 남은 시간을 반환한다", () => {
    vi.setSystemTime(new Date("2026-04-28T13:30:00Z"));

    const result = getLightningParticipationTimeDisplay({
      ...baseMeeting,
      status: LIGHTNING_STATUS.SUCCESS,
    });

    expect(result.statusLabel).toBe("모집완료");
    expect(result.subText).toBe("90분 뒤 종료");
    expect(result.detailRemainingText).toBe("90분 뒤 종료");
  });

  it("END면 종료 배지를 반환한다", () => {
    const result = getLightningParticipationTimeDisplay({
      ...baseMeeting,
      status: LIGHTNING_STATUS.END,
    });

    expect(result.statusLabel).toBe("종료");
  });

  it("now 인자를 넘기면 해당 시각 기준으로 계산한다", () => {
    const now = dayjs("2026-04-28T11:59:30Z");

    const result = getLightningParticipationTimeDisplay(baseMeeting, now);

    expect(result.detailRemainingText).toBe("0분 30초 뒤 마감");
  });
});
