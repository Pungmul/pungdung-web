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
  const { data: serverUserLocation, isFetched: serverLocationFetched } =
    useQuery(lightningQueries.userLocation());
  const fallbackReady = myInfoQuery.isFetched && clubListQuery.isFetched;
  const schoolKeyword = resolveSchoolNameFromGroupName(
    myInfoQuery.data?.groupName,
    clubListQuery.data ?? []
  );

  useEffect(() => {
    if (!fallbackReady || !serverLocationFetched) {
      return;
    }

    void hydrateResolvedLocation(
      schoolKeyword,
      isFiniteLatLng(serverUserLocation) ? serverUserLocation : null
    );
  }, [
    fallbackReady,
    schoolKeyword,
    serverLocationFetched,
    serverUserLocation,
  ]);

  useEffect(() => {
    if (!currentLocation) {
      return;
    }

    void syncResolvedLocationToServer(
      isFiniteLatLng(serverUserLocation) ? serverUserLocation : null
    );
  }, [currentLocation, serverUserLocation]);
};
