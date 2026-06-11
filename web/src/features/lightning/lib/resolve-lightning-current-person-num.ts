import type { LightningMeetingDto } from "../api/client/dto.schema";

/** 서버 `currentPersonNum` 우선, 없으면 프로필·레거시 participant list로 추정 */
export function resolveLightningCurrentPersonNum(
  dto: LightningMeetingDto
): number {
  if (dto.currentPersonNum != null) {
    return dto.currentPersonNum;
  }
  const profiles = dto.participantProfiles ?? [];
  if (profiles.length > 0) {
    return profiles.length;
  }
  return dto.lightningMeetingParticipantList.length + 1;
}
