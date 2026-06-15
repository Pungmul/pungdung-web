import type { LightningMeetingDto } from "../api/client/dto.schema";

/** search STOMP 스냅샷에 참여자 갱신 필드가 실려 왔는지 판별 */
export function hasLightningSocketParticipantPayload(
  dto: LightningMeetingDto
): boolean {
  return (
    dto.currentPersonNum != null ||
    (dto.participantProfiles?.length ?? 0) > 0 ||
    dto.lightningMeetingParticipantList.length > 0
  );
}
