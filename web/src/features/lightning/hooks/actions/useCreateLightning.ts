"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateLocation } from "@/features/location";

import { createLightning } from "../../api/client";
import type { CreateLightningResponse } from "../../api/client/dto.schema";
import { lightningQueries } from "../../queries";
import { buildLightningRequest } from "../../services/build-lightning-request";
import type { LightningCreateFormData } from "../../types/schemas";

export const useCreateLightning = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      formData: LightningCreateFormData
    ): Promise<CreateLightningResponse> => {
      await updateLocation();
      const request = buildLightningRequest(formData);
      return createLightning(request);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries(lightningQueries.lightningData()),
        queryClient.refetchQueries(lightningQueries.participationStatus()),
      ]);
    },
  });
};
