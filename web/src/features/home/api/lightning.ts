import { clubListApi } from "@/features/club";
import {
  fetchNearLightning,
  type NearLightningType,
} from "@/features/lightning";
import { getMyPageInfo } from "@/features/my-page";

import { fetchUserLocation } from "@/features/location/api/client";
import {
  isFiniteLatLng,
  resolveSchoolNameFromGroupName,
} from "@/features/location/lib";
import {
  getGeolocationUserMessage,
  hydrateResolvedLocation,
  syncResolvedLocationToServer,
} from "@/features/location/services";
import { locationStore } from "@/features/location/store";

function getThrownMessage(error: unknown): string {
  const geoMsg = getGeolocationUserMessage(error);
  if (geoMsg !== null) return geoMsg;

  if (error instanceof Error) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "알 수 없는 에러";
}

export async function loadNearLightning(): Promise<NearLightningType[]> {
  try {
    const userLocation = await fetchUserLocation();
    const store = locationStore.getState();

    if (store.locationSource == null) {
      const member = await getMyPageInfo().catch(() => null);
      const clubList = await clubListApi().catch(() => []);
      await hydrateResolvedLocation(
        resolveSchoolNameFromGroupName(member?.groupName, clubList)
      );
    }

    await syncResolvedLocationToServer(
      isFiniteLatLng(userLocation) ? userLocation : null
    );

    const { lightningMeetingList } = await fetchNearLightning();
    return lightningMeetingList;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    throw new Error(getThrownMessage(error));
  }
}
