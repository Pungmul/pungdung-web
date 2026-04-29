"use client";

import { useSocketSubscription } from "@pungdung/worker-socket-bridge/react";

import { useLightningSocketSnapshot } from "./useLightningSocketSnapshot";
import { useSyncParticipationStatusFromSocketList } from "./useSyncParticipationStatusFromSocketList";

export const useWholeLightningSocket = () => {
  const syncParticipationStatus = useSyncParticipationStatusFromSocketList();
  const { snapshotMeetings, onSnapshotMessage } = useLightningSocketSnapshot({
    scope: "whole",
    syncParticipationStatus,
  });

  useSocketSubscription({
    topic: "/sub/lightning-meeting/search",
    onMessage: onSnapshotMessage,
  });

  return snapshotMeetings;
};
