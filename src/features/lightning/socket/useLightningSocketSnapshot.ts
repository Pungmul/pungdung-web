"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { lightningQueries } from "../queries";
import { parseLightningSocketMeetings } from "../services";

import type { LightningListSocketScope } from "../types";

type UseLightningSocketSnapshotParams = {
  scope: LightningListSocketScope;
  syncParticipationStatus: (scope: LightningListSocketScope) => void;
};

export const useLightningSocketSnapshot = ({
  scope,
  syncParticipationStatus,
}: UseLightningSocketSnapshotParams) => {
  const queryClient = useQueryClient();
  const lightningDataQueryKey = lightningQueries.lightningData().queryKey;

  const onSnapshotMessage = useCallback(
    (content: unknown) => {
      const meetings = parseLightningSocketMeetings(content);
      if (!meetings) {
        console.error("Invalid lightning socket message content");
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: lightningDataQueryKey,
        refetchType: "all",
      });
      syncParticipationStatus(scope);
    },
    [lightningDataQueryKey, queryClient, scope, syncParticipationStatus]
  );

  return { onSnapshotMessage };
};
