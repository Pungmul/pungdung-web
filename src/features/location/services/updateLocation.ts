import { locationStore } from "../store";
import { LocationType } from "../types";

import { updateUserLocation } from "../api/client";

export const updateLocation = async (): Promise<LocationType> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { currentLocation, getCurrentPosition } = locationStore.getState();

      let patchPosition = currentLocation;

      if (!patchPosition) {
        const position = await getCurrentPosition();
        if (!position) {
          reject(new Error("위치 정보를 가져올 수 없습니다."));
          return;
        }
        patchPosition = position;
      }

      if (!patchPosition) {
        reject(new Error("위치 정보를 가져오는데 실패했습니다."));
        return;
      }

      await updateUserLocation({
        latitude: patchPosition.latitude,
        longitude: patchPosition.longitude,
      });

      resolve(patchPosition);
    } catch (error) {
      reject(error);
    }
  });
};
