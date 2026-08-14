"use client";

import { useQueryClient } from "@tanstack/react-query";

import { LocationAllowCta } from "@/features/location";

import { nearLightningQueryKey } from "../../constant/near-lightning-query-key";

export function HomeNearLightningAllowCta() {
  const queryClient = useQueryClient();

  return (
    <LocationAllowCta
      onAllowed={() =>
        queryClient.invalidateQueries({ queryKey: nearLightningQueryKey })
      }
    />
  );
}
