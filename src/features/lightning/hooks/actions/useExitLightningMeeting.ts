"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { lightningMutationOptions } from "../../queries";
import { lightningQueries } from "../../queries";

export const useExitLightningMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...lightningMutationOptions.exitMeeting(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(lightningQueries.participationStatus());
    },
  });
};
