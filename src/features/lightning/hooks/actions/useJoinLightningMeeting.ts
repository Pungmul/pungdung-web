"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { lightningMutationOptions } from "../../queries";
import { lightningQueries } from "../../queries";

export const useJoinLightningMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...lightningMutationOptions.joinMeeting(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(lightningQueries.participationStatus());
    },
  });
};
