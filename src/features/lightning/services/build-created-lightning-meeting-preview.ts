import type { CreateLightningResponse } from "../api/client/dto.schema";
import { LIGHTNING_STATUS } from "../constants";
import type { LightningMeeting } from "../types";
import type { LightningCreateFormData } from "../types/schemas";
import { buildLightningRequest } from "./build-lightning-request";

/**
 * 생성 API 응답과 폼 값으로 완료 화면 `LightningCard`용 미리보기 모델을 만든다.
 * 서버가 돌려주는 필드는 `id`·`meetingName`을 우선한다.
 */
export function buildCreatedLightningMeetingPreview(
  formData: LightningCreateFormData,
  created: CreateLightningResponse
): LightningMeeting {
  const req = buildLightningRequest(formData);
  const stamp = req.recruitmentEndTime;

  return {
    id: created.lightningMeetingId,
    meetingName: created.lightningMeetingName,
    recruitmentEndTime: req.recruitmentEndTime,
    startTime: req.startTime,
    endTime: req.endTime,
    minPersonNum: req.minPersonNum,
    maxPersonNum: req.maxPersonNum,
    organizerId: 0,
    meetingType: req.meetingType,
    latitude: req.latitude,
    longitude: req.longitude,
    buildingName: req.buildingName,
    locationDetail: req.locationDetail,
    tags: req.tags,
    lightningMeetingParticipantList: [],
    instrumentAssignmentList: [],
    status: LIGHTNING_STATUS.OPEN,
    notificationSent: false,
    visibilityScope: req.visibilityScope,
    createdAt: stamp,
    updatedAt: stamp,
  };
}
