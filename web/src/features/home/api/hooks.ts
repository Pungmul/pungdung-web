import { useSuspenseQuery } from "@tanstack/react-query";

import { loadNearLightning } from "./lightning";

export function useNearLightningQuery() {
  return useSuspenseQuery({
    queryKey: ["nearLightning"],
    queryFn: loadNearLightning,
    retry: false,
    refetchOnMount: "always",
  });
}
