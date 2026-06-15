import type { LightningMeeting } from "../types";

/** search 소켓에 참여자 필드가 없으면 기존 스냅샷·HTTP 캐시 값을 유지 */
export function mergeLightningMeetingSocketSnapshot(
  incoming: LightningMeeting,
  existing: LightningMeeting | undefined,
  hasParticipantPayload: boolean
): LightningMeeting {
  if (!existing || hasParticipantPayload) {
    return incoming;
  }

  return {
    ...incoming,
    currentPersonNum: existing.currentPersonNum,
    participantProfiles: existing.participantProfiles,
    lightningMeetingParticipantList: existing.lightningMeetingParticipantList,
  };
}
