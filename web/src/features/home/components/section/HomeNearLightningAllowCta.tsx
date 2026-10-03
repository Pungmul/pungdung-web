"use client";

import { useQueryClient } from "@tanstack/react-query";

import { LocationAllowCta, locationQueryKeys, syncResolvedLocationToServer } from "@/features/location";

import { nearLightningQueryKey } from "../../constant/near-lightning-query-key";

export function HomeNearLightningAllowCta() {
  const queryClient = useQueryClient();

  return (
    <LocationAllowCta
      onAllowed={async () => {
        await syncResolvedLocationToServer();
        await queryClient.invalidateQueries({ queryKey: locationQueryKeys.user() });
        await queryClient.invalidateQueries({ queryKey: nearLightningQueryKey });
      }}
    />
  );
}
