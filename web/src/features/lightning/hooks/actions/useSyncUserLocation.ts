"use client";

import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { clubQueries } from "@/features/club";
import {
  hydrateResolvedLocation,
  isFiniteLatLng,
  locationStore,
  resolveSchoolNameFromGroupName,
  syncResolvedLocationToServer,
} from "@/features/location";
import { myPageQueries } from "@/features/my-page";

import { lightningQueries } from "../../queries";

export const useSyncUserLocation = () => {
  const currentLocation = locationStore((state) => state.currentLocation);
  const myInfoQuery = useQuery(myPageQueries.info());
  const clubListQuery = useQuery(clubQueries.list());
  const { data: serverUserLocation } = useQuery(
    lightningQueries.userLocation()
  );
  const fallbackReady = myInfoQuery.isFetched && clubListQuery.isFetched;
  const schoolKeyword = resolveSchoolNameFromGroupName(
    myInfoQuery.data?.groupName,
    clubListQuery.data ?? []
  );

  useEffect(() => {
    if (!fallbackReady) {
      return;
    }

    void hydrateResolvedLocation(schoolKeyword);
  }, [fallbackReady, schoolKeyword]);

  useEffect(() => {
    if (!currentLocation) {
      return;
    }

    void syncResolvedLocationToServer(
      isFiniteLatLng(serverUserLocation) ? serverUserLocation : null
    );
  }, [currentLocation, serverUserLocation]);
};
