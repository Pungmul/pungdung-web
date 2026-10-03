"use client";

import { useQueryClient } from "@tanstack/react-query";

import { LocationAllowCta, syncResolvedLocationToServer } from "@/features/location";

import { lightningQueries } from "../../../queries";

import { nearLightningQueryKey } from "@/features/home/constant/near-lightning-query-key";

export function LightningLocationAllowCta() {
  const queryClient = useQueryClient();

  return (
    <LocationAllowCta
      onAllowed={async () => {
        await syncResolvedLocationToServer();
        await queryClient.invalidateQueries(lightningQueries.userLocation());
        await queryClient.invalidateQueries(lightningQueries.all());
        await queryClient.invalidateQueries({ queryKey: nearLightningQueryKey });
      }}
    />
  );
}
