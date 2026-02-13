"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { Toast } from "@/shared";

import { useExitLightningMeeting } from "./useExitLightningMeeting";
import { lightningQueries } from "../../queries";

/**
 * `LightningInformation` 패널: 탈퇴 후 목록·참여 상태 쿼리를 갱신하고 토스트로 결과를 알린다.
 */
export function useLightningExitAction(meetingId: number | undefined) {
  const queryClient = useQueryClient();
  const { mutateAsync: leaveMeeting } = useExitLightningMeeting();

  const handleLeaveLightningMeeting = useCallback(async () => {
    if (!meetingId) return;
    try {
      await leaveMeeting({ lightningMeetingId: meetingId });
      await queryClient.invalidateQueries(lightningQueries.all());
      Toast.show({ message: "번개 탈퇴에 성공했습니다.", type: "success" });
    } catch {
      Toast.show({ message: "번개 탈퇴에 실패했습니다.", type: "error" });
    }
  }, [meetingId, leaveMeeting, queryClient]);

  return { handleLeaveLightningMeeting };
}
