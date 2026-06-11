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

export const useSyncParticipationStatusFromSocketList = () => {
  const queryClient = useQueryClient();
  const participationStatusQueryKey = lightningQueries.participationStatus().queryKey;

  return useCallback(
    (scope: LightningListSocketScope) => {
      const participationStatus =
        queryClient.getQueryData<UserParticipationData>(
          participationStatusQueryKey
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

      void queryClient.invalidateQueries({
        queryKey: participationStatusQueryKey,
        refetchType: "all",
      });
    },
    [participationStatusQueryKey, queryClient]
  );
};
