import type { LightningMeeting } from "../types";

/**
 * TEMP: `/api/lightning/status` 응답의 참여자 프로필이 비어 있을 때,
 * `/api/lightning/search` 목록의 동일 id 모임 데이터로 보완한다.
 */
export function mergeParticipationMeetingParticipantsFromSearch(
  participationMeeting: LightningMeeting | null | undefined,
  searchMeetings: LightningMeeting[]
): LightningMeeting | null {
  if (!participationMeeting) {
    return null;
  }

  const meetingFromSearch = searchMeetings.find(
    (meeting) => meeting.id === participationMeeting.id
  );

  if (!meetingFromSearch) {
    return participationMeeting;
  }

  const hasParticipationProfiles =
    participationMeeting.participantProfiles.length > 0;
  const hasSearchProfiles = meetingFromSearch.participantProfiles.length > 0;

  if (hasParticipationProfiles || !hasSearchProfiles) {
    return participationMeeting;
  }

  return {
    ...participationMeeting,
    participantProfiles: meetingFromSearch.participantProfiles,
    currentPersonNum: meetingFromSearch.currentPersonNum,
  };
}
