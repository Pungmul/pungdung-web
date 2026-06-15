import { VISIBILITY_SCOPE } from "../constants";

import type {
  LightningListSocketScope,
  LightningMeeting,
  UserParticipationData,
} from "../types";

const socketScopeVisibility = {
  whole: VISIBILITY_SCOPE.ALL,
  school: VISIBILITY_SCOPE.SCHOOL_ONLY,
} as const satisfies Record<LightningListSocketScope, string>;

export type ParticipationStatusSocketSyncSkipReason =
  | "not_participant"
  | "missing_lightning_meeting"
  | "scope_mismatch"
  | "changed_meeting_not_participating";

export type ParticipationStatusSocketSyncDecision =
  | { shouldRefetch: true; meetingId: number }
  | {
      shouldRefetch: false;
      reason: ParticipationStatusSocketSyncSkipReason;
      meetingId?: number;
    };

const isParticipationInSocketScope = (
  participationMeeting: LightningMeeting,
  scope: LightningListSocketScope
) =>
  participationMeeting.visibilityScope === socketScopeVisibility[scope];

/** 소켓 delta에 참여 중인 번개가 포함될 때만 participationStatus refetch */
export function shouldRefetchParticipationStatusFromSocket({
  participationStatus,
  scope,
  changedMeetings,
}: {
  participationStatus: UserParticipationData | undefined;
  scope: LightningListSocketScope;
  changedMeetings: LightningMeeting[];
}): ParticipationStatusSocketSyncDecision {
  if (!participationStatus?.participant) {
    return { shouldRefetch: false, reason: "not_participant" };
  }

  const participationMeeting = participationStatus.lightningMeeting;
  if (!participationMeeting) {
    return { shouldRefetch: false, reason: "missing_lightning_meeting" };
  }

  if (!isParticipationInSocketScope(participationMeeting, scope)) {
    return {
      shouldRefetch: false,
      reason: "scope_mismatch",
      meetingId: participationMeeting.id,
    };
  }

  const changedMeetingIds = new Set(changedMeetings.map((meeting) => meeting.id));
  if (!changedMeetingIds.has(participationMeeting.id)) {
    return {
      shouldRefetch: false,
      reason: "changed_meeting_not_participating",
      meetingId: participationMeeting.id,
    };
  }

  return { shouldRefetch: true, meetingId: participationMeeting.id };
}
