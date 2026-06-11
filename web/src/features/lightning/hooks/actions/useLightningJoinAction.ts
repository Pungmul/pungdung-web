"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { Alert, Toast } from "@/shared";

import { joinLightningMeeting } from "../../api/client";
import { lightningQueries } from "../../queries";

/**
 * 카드 목록: 확인 후 참여·쿼리 갱신·토스트.
 */
export function useLightningJoinAction() {
  const queryClient = useQueryClient();

  const handleJoinLightningMeeting = useCallback(
    ({ meetingId }: { meetingId: number }) => {
      Alert.confirm({
        title: "번개 참여",
        message:
          "번개에 참여하시겠습니까? 번개 참여 후 참여 취소는 불가능합니다.",
        onConfirm: () => {
          void (async () => {
            try {
              await joinLightningMeeting({ meetingId });
              await queryClient.invalidateQueries(lightningQueries.all());
              Toast.show({
                message: "번개 참여에 성공했습니다.",
                type: "success",
              });
            } catch {
              Toast.show({
                message: "번개 참여에 실패했습니다.",
                type: "error",
              });
            }
          })();
        },
      });
    },
    [queryClient]
  );

  return { handleJoinLightningMeeting };
}
