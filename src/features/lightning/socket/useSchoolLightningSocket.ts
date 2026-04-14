"use client";

import { useMemo } from "react";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useSocketSubscription } from "@/core/socket";

import { clubQueries, mapClubToSchoolName } from "@/features/club";
import { myPageQueries } from "@/features/my-page";

import { useLightningSocketSnapshot } from "./useLightningSocketSnapshot";
import { useSyncParticipationStatusFromSocketList } from "./useSyncParticipationStatusFromSocketList";

export const useSchoolLightningSocket = () => {
  const { data: myInfo } = useQuery(myPageQueries.info());
  const { data: clubList } = useSuspenseQuery(clubQueries.list());
  const syncParticipationStatus = useSyncParticipationStatusFromSocketList();
  const { snapshotMeetings, onSnapshotMessage } = useLightningSocketSnapshot({
    scope: "school",
    syncParticipationStatus,
  });

  const schoolTopic = useMemo(
    () =>
      myInfo?.groupName && clubList
        ? `/sub/lightning-meeting/search/${mapClubToSchoolName(
            clubList,
            myInfo.groupName
          )}`
        : undefined,
    [clubList, myInfo?.groupName]
  );

  useSocketSubscription({
    topic: schoolTopic,
    onMessage: onSnapshotMessage,
    enabled: !!schoolTopic,
  });

  return snapshotMeetings;
};
