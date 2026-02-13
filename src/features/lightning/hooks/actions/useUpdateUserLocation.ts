"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { lightningMutationOptions } from "../../queries";
import { lightningQueries } from "../../queries";

export const useUpdateUserLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...lightningMutationOptions.updateUserLocation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(lightningQueries.userLocation());
    },
  });
};
