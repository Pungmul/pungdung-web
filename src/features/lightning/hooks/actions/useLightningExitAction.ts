"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { Alert, Toast } from "@/shared";

import { exitLightningMeeting } from "../../api/client";
import { lightningQueries } from "../../queries";

/**
 * `LightningInformation` 패널: 확인 후 탈퇴·쿼리 갱신·토스트.
 */
export function useLightningExitAction(meetingId: number | undefined) {
  const queryClient = useQueryClient();

  const handleLeaveLightningMeeting = useCallback(() => {
    if (!meetingId) return;

    Alert.confirm({
      title: "참여 취소",
      message: "정말 참여를 취소하시겠습니까?",
      onConfirm: () => {
        void (async () => {
          try {
            await exitLightningMeeting({ lightningMeetingId: meetingId });
            await queryClient.invalidateQueries(lightningQueries.all());
            Toast.show({
              message: "번개 탈퇴에 성공했습니다.",
              type: "success",
            });
          } catch {
            Toast.show({ message: "번개 탈퇴에 실패했습니다.", type: "error" });
          }
        })();
      },
    });
  }, [meetingId, queryClient]);

  return { handleLeaveLightningMeeting };
}
