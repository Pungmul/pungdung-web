import { VISIBILITY_SCOPE } from "../constants";

import { mergeLightningMeetingSocketSnapshot } from "./merge-lightning-meeting-socket-snapshot";
import { shouldRetainLightningMeetingInSearchList } from "./should-retain-lightning-meeting-in-search-list";
import type {
  LightningListData,
  LightningListSocketScope,
  LightningListSocketSnapshotEntry,
  LightningMeeting,
} from "../types";

/** React Query cache read는 caller(hook/socket handler) 책임 */
export function selectLightningMeetingsForListSocketScope(
  data: LightningListData | undefined,
  scope: LightningListSocketScope
): LightningMeeting[] {
  if (!data) {
    return [];
  }

  return scope === "whole"
    ? [...data.normalLightningMeetings, ...data.schoolLightningMeetings]
    : data.schoolLightningMeetings;
}

/** search STOMP delta entries merged against cached HTTP meetings by id */
export function mergeLightningListSocketSnapshotMeetings({
  entries,
  cachedMeetings,
}: {
  entries: LightningListSocketSnapshotEntry[];
  cachedMeetings: LightningMeeting[];
}): LightningMeeting[] {
  return entries.map(({ meeting, hasParticipantPayload }) => {
    const existing = cachedMeetings.find(
      (httpMeeting) => httpMeeting.id === meeting.id
    );

    return mergeLightningMeetingSocketSnapshot(
      meeting,
      existing,
      hasParticipantPayload
    );
  });
}

/**
 * merge 결과를 `lightningData` 캐시 스냅샷에 반영. `setQueryData`는 caller 책임.
 * delta에 포함되지 않은 meeting staleness는 websocket reconnect 시 HTTP refetch로 보정한다.
 */
export function patchLightningListDataMeetings(
  prev: LightningListData | undefined,
  patchedMeetings: LightningMeeting[]
): LightningListData {
  const base: LightningListData = prev ?? {
    normalLightningMeetings: [],
    schoolLightningMeetings: [],
  };

  const removeMeetingFromList = (
    meetings: LightningMeeting[],
    meetingId: number
  ) => meetings.filter((item) => item.id !== meetingId);

  const patchMeetingInList = (
    meetings: LightningMeeting[],
    meeting: LightningMeeting
  ) => {
    const index = meetings.findIndex((item) => item.id === meeting.id);
    if (index === -1) {
      return [...meetings, meeting];
    }

    const next = [...meetings];
    next[index] = meeting;
    return next;
  };

  const applyMeetingToList = (
    meetings: LightningMeeting[],
    meeting: LightningMeeting
  ) => {
    if (!shouldRetainLightningMeetingInSearchList(meeting.status)) {
      return removeMeetingFromList(meetings, meeting.id);
    }

    return patchMeetingInList(meetings, meeting);
  };

  return patchedMeetings.reduce<LightningListData>(
    (next, meeting) =>
      meeting.visibilityScope === VISIBILITY_SCOPE.SCHOOL_ONLY
        ? {
            ...next,
            schoolLightningMeetings: applyMeetingToList(
              next.schoolLightningMeetings,
              meeting
            ),
          }
        : {
            ...next,
            normalLightningMeetings: applyMeetingToList(
              next.normalLightningMeetings,
              meeting
            ),
          },
    {
      normalLightningMeetings: [...base.normalLightningMeetings],
      schoolLightningMeetings: [...base.schoolLightningMeetings],
    }
  );
}
