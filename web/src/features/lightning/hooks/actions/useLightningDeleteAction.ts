"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { Alert, Toast } from "@/shared";

import { deleteLightningMeeting } from "../../api/client";
import { lightningQueries } from "../../queries";

/**
 * `LightningParticipationOverlay` 패널: 확인 후 삭제·쿼리 갱신·토스트.
 */
export function useLightningDeleteAction(meetingId: number | undefined) {
  const queryClient = useQueryClient();

  const handleDeleteLightningMeeting = useCallback(() => {
    if (!meetingId) return;

    Alert.confirm({
      title: "번개 삭제",
      message: "정말 이 번개를 삭제하시겠습니까?",
      onConfirm: () => {
        void (async () => {
          try {
            await deleteLightningMeeting({ lightningMeetingId: meetingId });
            await queryClient.invalidateQueries(lightningQueries.all());
            Toast.show({
              message: "번개 삭제에 성공했습니다.",
              type: "success",
            });
          } catch {
            Toast.show({ message: "번개 삭제에 실패했습니다.", type: "error" });
          }
        })();
      },
    });
  }, [meetingId, queryClient]);

  return { handleDeleteLightningMeeting };
}
