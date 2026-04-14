"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { VISIBILITY_SCOPE } from "../constants";
import { lightningQueries } from "../queries";

import type {
  LightningListSocketScope,
  LightningMeeting,
  UserParticipationData,
} from "../types";

const socketScopeVisibility = {
  whole: VISIBILITY_SCOPE.ALL,
  school: VISIBILITY_SCOPE.SCHOOL_ONLY,
} as const satisfies Record<LightningListSocketScope, string>;

const isParticipationInSocketScope = (
  participationMeeting: LightningMeeting | null | undefined,
  scope: LightningListSocketScope
) =>
  !!participationMeeting &&
  participationMeeting.visibilityScope === socketScopeVisibility[scope];

const findParticipationMeetingInSnapshot = (
  meetings: LightningMeeting[],
  participationMeeting: LightningMeeting
) =>
  meetings.find((meeting) => meeting.id === participationMeeting.id);

const hasSameParticipationSnapshot = (
  nextMeeting: LightningMeeting,
  currentMeeting: LightningMeeting
) =>
  nextMeeting.updatedAt === currentMeeting.updatedAt &&
  nextMeeting.currentPersonNum === currentMeeting.currentPersonNum &&
  nextMeeting.status === currentMeeting.status;

export const useSyncParticipationStatusFromSocketList = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (scope: LightningListSocketScope, meetings: LightningMeeting[]) => {
      const participationStatus =
        queryClient.getQueryData<UserParticipationData>(
          lightningQueries.participationStatus().queryKey
        );

      if (!participationStatus?.participant) {
        return;
      }

      const currentParticipationMeeting = participationStatus.lightningMeeting;
      if (
        !currentParticipationMeeting ||
        !isParticipationInSocketScope(currentParticipationMeeting, scope)
      ) {
        return;
      }

      const nextParticipationMeeting = findParticipationMeetingInSnapshot(
        meetings,
        currentParticipationMeeting
      );

      if (!nextParticipationMeeting) {
        void queryClient.refetchQueries({
          ...lightningQueries.participationStatus(),
          type: "active",
        });
        return;
      }

      if (
        hasSameParticipationSnapshot(
          nextParticipationMeeting,
          currentParticipationMeeting
        )
      ) {
        return;
      }

      queryClient.setQueryData<UserParticipationData>(
        lightningQueries.participationStatus().queryKey,
        (prev) =>
          prev?.participant
            ? {
                ...prev,
                lightningMeeting: nextParticipationMeeting,
              }
            : prev
      );
    },
    [queryClient]
  );
};
