"use client";

import { useCallback, useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useSocketSubscription } from "@/core/socket";

import {
  applyLightningListSocketPayload,
  isLightningMeetingMessage,
} from "../services";

import type { UserParticipationData } from "../types";

interface UseWholeLightningSocketProps {
  userParticipationData: UserParticipationData | undefined;
}

export const useWholeLightningSocket = ({
  userParticipationData,
}: UseWholeLightningSocketProps) => {
  const queryClient = useQueryClient();
  const participationRef = useRef<UserParticipationData | undefined>(
    userParticipationData
  );

  useEffect(() => {
    participationRef.current = userParticipationData;
  }, [userParticipationData]);

  const wholeCallback = useCallback(
    (content: unknown) => {
      if (!isLightningMeetingMessage(content)) {
        console.error("Invalid message content");
        return;
      }

      const { content: newWholeLightningMeetings } = content;
      applyLightningListSocketPayload(
        queryClient,
        newWholeLightningMeetings,
        "whole",
        participationRef.current
      );
      console.log("updated whole lightning list", newWholeLightningMeetings);
    },
    [queryClient]
  );

  useSocketSubscription({
    topic: "/sub/lightning-meeting/search",
    onMessage: wholeCallback,
  });
};
