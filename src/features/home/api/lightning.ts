import {
  fetchNearLightning,
  type NearLightningType,
} from "@/features/lightning";
import {
  fetchUserLocation,
  locationStore,
  updateUserLocation,
} from "@/features/location";

export async function loadNearLightning(): Promise<NearLightningType[]> {
  try {
    const userLocation = await fetchUserLocation();

    if (!userLocation) {
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
    if (error instanceof Error) throw Error(error.message);
    else throw Error("알수 없는 에러");
  }
}
