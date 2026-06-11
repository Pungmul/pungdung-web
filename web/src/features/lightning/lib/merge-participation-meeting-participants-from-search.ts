import type { LightningMeeting } from "../types";

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
