"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { Toast } from "@/shared";

import { useDeleteLightningMeeting } from "./useDeleteLightningMeeting";
import { lightningQueries } from "../../queries";

/**
 * `LightningInformation` 패널: 삭제 후 목록·참여 상태 쿼리를 갱신하고 토스트로 결과를 알린다.
 */
export function useLightningDeleteAction(meetingId: number | undefined) {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteMeeting } = useDeleteLightningMeeting();

  const handleDeleteLightningMeeting = useCallback(async () => {
    if (!meetingId) return;
    try {
      await deleteMeeting({ lightningMeetingId: meetingId });
      await queryClient.invalidateQueries(lightningQueries.all());
      Toast.show({ message: "번개 삭제에 성공했습니다.", type: "success" });
    } catch {
      Toast.show({ message: "번개 삭제에 실패했습니다.", type: "error" });
    }
  }, [meetingId, deleteMeeting, queryClient]);

  return { handleDeleteLightningMeeting };
}
