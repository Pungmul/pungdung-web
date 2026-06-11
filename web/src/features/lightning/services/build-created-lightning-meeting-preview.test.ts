import { describe, expect, it } from "vitest";

import type { LightningCreateFormData } from "../types/schemas";
import { buildCreatedLightningMeetingPreview } from "./build-created-lightning-meeting-preview";
import { buildLightningRequest } from "./build-lightning-request";

describe("buildCreatedLightningMeetingPreview", () => {
  const formBase = {
    title: "폼 제목",
    minPersonnel: 4,
    maxPersonnel: 12,
    recruitEndTime: "16:00",
    address: "도로명 주소",
    detailAddress: "건물 동·호",
    locationPoint: { latitude: 35.1, longitude: 129.05 },
    target: "우리 학교만",
    tagList: ["a", "b"],
  } satisfies Omit<LightningCreateFormData, "lightningType">;

  it("서버 응답 id·이름을 쓰고, 나머지는 buildLightningRequest와 동일하게 맞춘다", () => {
    const formData = {
      ...formBase,
      lightningType: "일반 모임",
    } satisfies LightningCreateFormData;

    const created = {
      lightningMeetingId: 9001,
      lightningMeetingName: "응답에서 온 이름",
      organizerName: "주최",
    };

    const req = buildLightningRequest(formData);
    const preview = buildCreatedLightningMeetingPreview(formData, created);

    expect(preview.id).toBe(created.lightningMeetingId);
    expect(preview.meetingName).toBe(created.lightningMeetingName);
    expect(preview.recruitmentEndTime).toBe(req.recruitmentEndTime);
    expect(preview.startTime).toBe(req.startTime);
    expect(preview.endTime).toBe(req.endTime);
    expect(preview.minPersonNum).toBe(req.minPersonNum);
    expect(preview.maxPersonNum).toBe(req.maxPersonNum);
    expect(preview.meetingType).toBe(req.meetingType);
    expect(preview.latitude).toBe(req.latitude);
    expect(preview.longitude).toBe(req.longitude);
    expect(preview.buildingName).toBe(req.buildingName);
    expect(preview.locationDetail).toBe(req.locationDetail);
    expect(preview.tags).toEqual(req.tags);
    expect(preview.visibilityScope).toBe(req.visibilityScope);

    expect(preview.organizerId).toBe(0);
    expect(preview.currentPersonNum).toBe(1);
    expect(preview.participantProfiles).toEqual([]);
    expect(preview.lightningMeetingParticipantList).toEqual([]);
    expect(preview.instrumentAssignmentList).toEqual([]);
    expect(preview.status).toBe("OPEN");
    expect(preview.notificationSent).toBe(false);
    expect(preview.createdAt).toBe(req.recruitmentEndTime);
    expect(preview.updatedAt).toBe(req.recruitmentEndTime);
  });

  it("풍물 모임이면 meetingType이 PAN으로 이어진다", () => {
    const formData = {
      ...formBase,
      lightningType: "풍물 모임",
    } satisfies LightningCreateFormData;

    const preview = buildCreatedLightningMeetingPreview(formData, {
      lightningMeetingId: 1,
      lightningMeetingName: "n",
      organizerName: "o",
    });

    expect(preview.meetingType).toBe("PAN");
  });
});
