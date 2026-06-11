import {
  fetchNearLightning,
  type NearLightningType,
} from "@/features/lightning";

import {
  fetchUserLocation,
  updateUserLocation,
} from "@/features/location/api/client";
import { getGeolocationUserMessage } from "@/features/location/services";
import { locationStore } from "@/features/location/store";

function isLocationValid(location: unknown): boolean {
  if (typeof location !== "object" || location === null) return false;
  const { latitude, longitude } = location as {
    latitude?: number | null;
    longitude?: number | null;
  };
  return (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  );
}

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

    if (!isLocationValid(userLocation)) {
      const newLocation = await locationStore.getState().getCurrentPosition();
      if (!newLocation) {
        throw new Error("위치 정보를 가져올 수 없습니다.");
      }
      await updateUserLocation({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
      });
    }

    const { lightningMeetingList } = await fetchNearLightning();
    return lightningMeetingList;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    throw new Error(getThrownMessage(error));
  }
}
