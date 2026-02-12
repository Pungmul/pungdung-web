import { queryOptions } from "@tanstack/react-query";

import { locationQueryKeys } from "@/features/location";

import { lightningQueryInternal } from "./lightning-query-internal";
import {
  fetchLightningData,
  fetchUserLocation,
  fetchUserParticipationStatus,
} from "../api/client";

const root = lightningQueryInternal.all();

/**
 * Lightning queryOptions.
 * useQuery(lightningQueries.lightningData()), invalidateQueries(lightningQueries.all()) 등.
 */
export const lightningQueries = {
  /** invalidateQueries, removeQueries 시 번개 feature 쿼리 전체 */
  all: () => ({ queryKey: root } as const),

  lightningData: () =>
    queryOptions({
      queryKey: lightningQueryInternal.data(),
      queryFn: fetchLightningData,
      staleTime: 30 * 1000,
      refetchOnMount: "always",
    }),

  participationStatus: () =>
    queryOptions({
      queryKey: lightningQueryInternal.status(),
      queryFn: fetchUserParticipationStatus,
      gcTime: 0,
      staleTime: 0,
      retry: 2,
    }),

  /** 위치 쿼리 키는 `@/features/location`과 동일하게 맞춘다. */
  userLocation: () =>
    queryOptions({
      queryKey: locationQueryKeys.user(),
      queryFn: fetchUserLocation,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 2,
    }),
};
