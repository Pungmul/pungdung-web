"use client";
import { create } from "zustand";
import { getInitialView } from "./view/getInitialView";
import { persistViewCookie } from "./view/viewCookie";
import { ViewType } from "../types";

interface ViewState {
  view: ViewType;
  setView: (view: ViewType) => void;
  initializeView: (view: ViewType) => void;
}

export const useViewStore = create<ViewState>((set, get) => ({
  view: getInitialView(),
  setView: (view: ViewType) => {
    if (get().view === view) {
      return;
    }
    set({ view });
    persistViewCookie(view);
  },
  initializeView: (view: ViewType) => {
    if (get().view === view) {
      return;
    }
    set({ view });
    persistViewCookie(view);
  },
}));

export function useView(): ViewType {
  const view = useViewStore((state) => state.view);

  return view;
}
