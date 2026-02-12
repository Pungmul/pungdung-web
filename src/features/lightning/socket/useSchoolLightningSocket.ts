"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useSocketSubscription } from "@/core/socket";

import { mapClubToSchoolName, useClubList } from "@/features/club";
import { useGetMyPageInfo } from "@/features/my-page";

import { applyLightningListSocketPayload } from "../services/apply-lightning-list-socket-payload";
import { isLightningMeetingMessage } from "../services/is-lightning-meeting-message";
import type { UserParticipationData } from "../types";

interface UseSchoolLightningSocketProps {
  userParticipationData: UserParticipationData | undefined;
}

export const useSchoolLightningSocket = ({
  userParticipationData,
}: UseSchoolLightningSocketProps) => {
  const { data: myInfo } = useGetMyPageInfo();
  const { data: clubList } = useClubList();

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

  const queryClient = useQueryClient();
  const participationRef = useRef<UserParticipationData | undefined>(
    userParticipationData
  );

  useEffect(() => {
    participationRef.current = userParticipationData;
  }, [userParticipationData]);

  const schoolCallback = useCallback(
    (content: unknown) => {
      if (!isLightningMeetingMessage(content)) {
        console.error("Invalid message content");
        return;
      }

      const { content: newSchoolLightningMeetings } = content;
      applyLightningListSocketPayload(
        queryClient,
        newSchoolLightningMeetings,
        "school",
        participationRef.current
      );
    },
    [queryClient]
  );

  useSocketSubscription({
    topic: schoolTopic,
    onMessage: schoolCallback,
    enabled: !!schoolTopic,
  });
};
