import { useSuspenseQuery } from "@tanstack/react-query";

import { fetchUserLocation } from "../api/client";
import { locationQueryKeys } from "../constant/queryKeys";

export const useUserLocation = () => {
  return useSuspenseQuery({
    queryKey: locationQueryKeys.user(),
    queryFn: fetchUserLocation,
    staleTime: 1000 * 30,
    gcTime: 1000 * 30,
  });
};
