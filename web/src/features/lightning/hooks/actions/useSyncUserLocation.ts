"use client";

import { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { clubQueries } from "@/features/club";
import {
  hydrateResolvedLocation,
  isFiniteLatLng,
  resolveSchoolNameFromGroupName,
  syncResolvedLocationToServer,
} from "@/features/location";
import { myPageQueries } from "@/features/my-page";

import { lightningQueries } from "../../queries";

export const useSyncUserLocation = () => {
  const queryClient = useQueryClient();
  const myInfoQuery = useQuery(myPageQueries.info());
  const clubListQuery = useQuery(clubQueries.list());
  const { data: serverUserLocation, isSuccess, isFetching } =
    useQuery({ ...lightningQueries.userLocation(), refetchOnMount: true });
  const fallbackReady = myInfoQuery.isFetched && clubListQuery.isFetched;
  const schoolKeyword = resolveSchoolNameFromGroupName(
    myInfoQuery.data?.groupName,
    clubListQuery.data ?? []
  );

  useEffect(() => {
    if (!fallbackReady || !isSuccess || isFetching) {
      return;
    }

    const serverLocation = isFiniteLatLng(serverUserLocation) ? serverUserLocation : null;
    void hydrateResolvedLocation(schoolKeyword, serverLocation)
      .then(async (hasGps) => {
        if (!hasGps) return;
        const result = await syncResolvedLocationToServer(serverLocation);
        if (result === "written") {
          void queryClient.invalidateQueries({ ...lightningQueries.userLocation(), refetchType: "none" });
        }
      })
      .catch((error: unknown) => console.error("위치 동기화 실패:", error));
  }, [
    fallbackReady,
    queryClient,
    schoolKeyword,
    isSuccess,
    isFetching,
    serverUserLocation,
  ]);

};
