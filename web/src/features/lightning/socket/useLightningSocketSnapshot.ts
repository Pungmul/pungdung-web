"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { lightningQueries } from "../queries";
import {
  mergeLightningListSocketSnapshotMeetings,
  parseLightningSocketSnapshotEntries,
  patchLightningListDataMeetings,
  selectLightningMeetingsForListSocketScope,
} from "../services";

import type { LightningListData } from "../types";
import type { LightningListSocketScope, LightningMeeting } from "../types";

type UseLightningSocketSnapshotParams = {
  scope: LightningListSocketScope;
  syncParticipationStatus: (
    scope: LightningListSocketScope,
    changedMeetings: LightningMeeting[]
  ) => void;
};

export const useLightningSocketSnapshot = ({
  scope,
  syncParticipationStatus,
}: UseLightningSocketSnapshotParams) => {
  const queryClient = useQueryClient();
  const lightningDataQueryKey = lightningQueries.lightningData().queryKey;

  const onSnapshotMessage = useCallback(
    (content: unknown) => {
      const entries = parseLightningSocketSnapshotEntries(content);
      if (!entries) {
        return;
      }

      let patchedMeetings: LightningMeeting[] = [];

      queryClient.setQueryData<LightningListData>(
        lightningDataQueryKey,
        (current) => {
          const cachedMeetings = selectLightningMeetingsForListSocketScope(
            current,
            scope
          );
          patchedMeetings = mergeLightningListSocketSnapshotMeetings({
            entries,
            cachedMeetings,
          });

          return patchLightningListDataMeetings(current, patchedMeetings);
        }
      );

      syncParticipationStatus(scope, patchedMeetings);
    },
    [lightningDataQueryKey, queryClient, scope, syncParticipationStatus]
  );

  return { onSnapshotMessage };
};
