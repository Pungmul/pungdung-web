import { create } from "zustand";

import { throttle } from "lodash";

import { LocationType } from "../types";

// 클라이언트 상태만 관리하는 인터페이스
interface LocationState {
  // 클라이언트 상태
  currentLocation: LocationType | null;
  isWatching: boolean;
  watchId: number | null;
  error: GeolocationPositionError | null;

  // Actions (클라이언트 상태만 변경)
  setCurrentLocation: (location: LocationType) => void;
  setError: (error: GeolocationPositionError | null) => void;
  startWatching: () => void;
  stopWatching: () => void;
  getCurrentPosition: () => Promise<LocationType | null>;
}

export const locationStore = create<LocationState>((set, get) => ({
  // 클라이언트 상태
  currentLocation: null,
  isWatching: false,
  watchId: null,
  error: null,

  setCurrentLocation: (location: LocationType) => {
    set({ currentLocation: location });
  },

  setError: (error: GeolocationPositionError | null) => {
    set({ error });
  },

  getCurrentPosition: async () => {
    const { currentLocation } = get();

    // 이미 위치 정보가 있으면 즉시 반환
    if (currentLocation?.latitude && currentLocation?.longitude) {
      return currentLocation;
    }

    return new Promise((resolve, reject) => {
      const { geolocation } = navigator;

      if (!geolocation) {
        const error = new Error(
          "Geolocation is not supported by this browser."
        );
        console.warn(error.message);
        reject(error);
        return;
      }

      geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          get().setCurrentLocation(newLocation);
          resolve(newLocation);
        },
        (error) => {
          console.warn("Geolocation error:", error);
          get().setError(error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  },

  startWatching: () => {
    const { geolocation } = navigator;

    if (!geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    const { isWatching } = get();
    if (isWatching) {
      return; // 이미 감시 중이면 리턴
    }

    // throttled 위치 업데이트 함수 (10초마다)
    const throttledSetLocation = throttle((position: GeolocationPosition) => {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      get().setCurrentLocation(newLocation);
    }, 1000 * 10);

    const watchId = geolocation.watchPosition(
      throttledSetLocation,
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.error("Permission denied for geolocation");
        } else {
          console.error("Geolocation error:", error);
        }
        get().setError(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    set({ isWatching: true, watchId, error: null });
  },

  stopWatching: () => {
    const { watchId } = get();

    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      set({ isWatching: false, watchId: null });
    }
  },
}));
