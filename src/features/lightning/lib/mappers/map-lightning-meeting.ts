import type { LightningMeetingDto } from "../../api/client/dto.schema";
import type { LightningMeeting } from "../../types";

/**
 * 스키마로 검증된 모임 DTO → 앱에서 쓰는 `LightningMeeting` (null·필드 정규화).
 */
export function mapLightningMeeting(
  dto: LightningMeetingDto
): LightningMeeting {
  return {
    id: dto.id,
    meetingName: dto.meetingName,
    recruitmentEndTime: dto.recruitmentEndTime,
    startTime: dto.startTime,
    endTime: dto.endTime,
    minPersonNum: dto.minPersonNum,
    maxPersonNum: dto.maxPersonNum,
    organizerId: dto.organizerId,
    meetingType: dto.meetingType,
    latitude: dto.latitude,
    longitude: dto.longitude,
    buildingName: dto.buildingName,
    locationDetail: dto.locationDetail,
    tags: dto.tags ?? [],
    lightningMeetingParticipantList: dto.lightningMeetingParticipantList,
    instrumentAssignmentList: dto.instrumentAssignmentList,
    status: dto.status,
    notificationSent: dto.notificationSent,
    visibilityScope: dto.visibilityScope,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
