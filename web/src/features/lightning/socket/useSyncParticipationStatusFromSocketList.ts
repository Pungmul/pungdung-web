"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { lightningQueries } from "../queries";

import { shouldRefetchParticipationStatusFromSocket } from "../services/should-refetch-participation-status-from-socket";
import type { LightningListSocketScope, LightningMeeting } from "../types";
import type { UserParticipationData } from "../types/user-participation.types";

export const useSyncParticipationStatusFromSocketList = () => {
  const queryClient = useQueryClient();
  const participationStatusQueryKey = lightningQueries.participationStatus().queryKey;

  return useCallback(
    (scope: LightningListSocketScope, changedMeetings: LightningMeeting[]) => {
      const participationStatus =
        queryClient.getQueryData<UserParticipationData>(
          participationStatusQueryKey
        );

      const decision = shouldRefetchParticipationStatusFromSocket({
        participationStatus,
        scope,
        changedMeetings,
      });

      if (!decision.shouldRefetch) {
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
