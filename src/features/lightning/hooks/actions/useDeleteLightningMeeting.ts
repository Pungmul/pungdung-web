"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { lightningMutationOptions } from "../../queries";
import { lightningQueries } from "../../queries";

export const useDeleteLightningMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...lightningMutationOptions.deleteMeeting(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(lightningQueries.participationStatus());
    },
  });
};
