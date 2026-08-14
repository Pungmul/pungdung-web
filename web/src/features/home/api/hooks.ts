import { useSuspenseQuery } from "@tanstack/react-query";

import { loadNearLightning } from "./lightning";
import { nearLightningQueryKey } from "../constant/near-lightning-query-key";

export function useNearLightningQuery() {
  return useSuspenseQuery({
    queryKey: nearLightningQueryKey,
    queryFn: loadNearLightning,
    retry: false,
    refetchOnMount: "always",
  });
}
