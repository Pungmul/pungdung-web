"use client";

import { useCallback, useEffect, useState } from "react";

import { useSocketConnection } from "@pungdung/worker-socket-bridge/react";

import { parseLightningSocketMeetings } from "../services";

import type { LightningListSocketScope, LightningMeeting } from "../types";

type UseLightningSocketSnapshotParams = {
  scope: LightningListSocketScope;
  syncParticipationStatus: (
    scope: LightningListSocketScope,
    meetings: LightningMeeting[]
  ) => void;
};

export const useLightningSocketSnapshot = ({
  scope,
  syncParticipationStatus,
}: UseLightningSocketSnapshotParams) => {
  const isConnected = useSocketConnection();
  const [snapshotMeetings, setSnapshotMeetings] = useState<
    LightningMeeting[] | null
  >(null);

  useEffect(() => {
    if (!isConnected) {
      setSnapshotMeetings(null);
    }
  }, [isConnected]);

  const onSnapshotMessage = useCallback(
    (content: unknown) => {
      const meetings = parseLightningSocketMeetings(content);
      if (!meetings) {
        console.error("Invalid lightning socket message content");
        return;
      }

      setSnapshotMeetings(meetings);
      syncParticipationStatus(scope, meetings);
    },
    [scope, syncParticipationStatus]
  );

  return { snapshotMeetings, onSnapshotMessage };
};
