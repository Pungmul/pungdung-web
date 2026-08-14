import { create } from "zustand";

import { throttle } from "lodash";

import type { LocationSource, LocationType } from "../types";

export type LocationView = {
  currentLocation: LocationType | null;
  locationSource: LocationSource | null;
  locationLabel: string | null;
};

function requestBrowserGpsPosition(): Promise<LocationType> {
  return new Promise((resolve, reject) => {
    const { geolocation } = navigator;

    if (!geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
}

interface LocationState {
  currentLocation: LocationType | null;
  locationSource: LocationSource | null;
  locationLabel: string | null;
  isWatching: boolean;
  watchId: number | null;
  error: GeolocationPositionError | null;

  setResolvedLocation: (
    location: LocationType,
    source: LocationSource,
    label: string | null
  ) => void;
  getLocationView: () => LocationView;
  setLocationView: (view: LocationView) => void;
  setError: (error: GeolocationPositionError | null) => void;
  startWatching: () => void;
  stopWatching: () => void;
  requestGpsPosition: () => Promise<LocationType>;
  getCurrentPosition: () => Promise<LocationType | null>;
}

export const locationStore = create<LocationState>((set, get) => ({
  currentLocation: null,
  locationSource: null,
  locationLabel: null,
  isWatching: false,
  watchId: null,
  error: null,

  setResolvedLocation: (location, source, label) => {
    set({
      currentLocation: location,
      locationSource: source,
      locationLabel: label,
      error: null,
    });
  },

  getLocationView: () => {
    const { currentLocation, locationSource, locationLabel } = get();
    return { currentLocation, locationSource, locationLabel };
  },

  setLocationView: (view) => {
    set({
      currentLocation: view.currentLocation,
      locationSource: view.locationSource,
      locationLabel: view.locationLabel,
      error: null,
    });
  },

  setError: (error) => {
    set({ error });
  },

  requestGpsPosition: async () => {
    try {
      const newLocation = await requestBrowserGpsPosition();
      get().setResolvedLocation(newLocation, "gps", null);
      return newLocation;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        get().setError(error as GeolocationPositionError);
      }
      throw error;
    }
  },

  getCurrentPosition: async () => {
    const { currentLocation, locationSource } = get();
    if (currentLocation && locationSource === "gps") {
      return currentLocation;
    }

    return get().requestGpsPosition();
  },

  startWatching: () => {
    const { geolocation } = navigator;
    if (!geolocation) {
      return;
    }

    const { isWatching } = get();
    if (isWatching) {
      return;
    }

    const throttledSetLocation = throttle((position: GeolocationPosition) => {
      get().setResolvedLocation(
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        "gps",
        null
      );
    }, 1000 * 10);

    const watchId = geolocation.watchPosition(
      throttledSetLocation,
      (error) => {
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
