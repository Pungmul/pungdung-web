"use client";

import { useQueryClient } from "@tanstack/react-query";

import { LocationAllowCta } from "@/features/location";

import { lightningQueries } from "../../../queries";

import { nearLightningQueryKey } from "@/features/home/constant/near-lightning-query-key";

export function LightningLocationAllowCta() {
  const queryClient = useQueryClient();

  return (
    <LocationAllowCta
      onAllowed={async () => {
        await queryClient.invalidateQueries(lightningQueries.all());
        await queryClient.invalidateQueries({ queryKey: nearLightningQueryKey });
      }}
    />
  );
}
