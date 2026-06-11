import { create } from "zustand";

interface KakaoMapsStore {
  kakaoMapsLoaded: boolean;
  isInitializing: boolean;
  error: string | null;
  setIsInitializing: (value: boolean) => void;
  setLoaded: () => void;
  setError: (message: string | null) => void;
}

export const kakaoMapsStore = create<KakaoMapsStore>((set) => ({
  kakaoMapsLoaded: false,
  isInitializing: false,
  error: null,
  setIsInitializing: (value) => set({ isInitializing: value }),
  setLoaded: () => set({ kakaoMapsLoaded: true, isInitializing: false, error: null }),
  setError: (message) => set({ error: message, isInitializing: false }),
}));


