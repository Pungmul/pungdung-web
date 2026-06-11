"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
} from "react";

import { createStore } from "zustand";
import { useStore } from "zustand/react";

import { ViewType } from "@/shared/types";

import { persistViewCookie } from "./viewCookie";

interface ViewState {
  view: ViewType;
  setView: (view: ViewType) => void;
}

export type ViewStore = ReturnType<typeof createViewStore>;

function createViewStore(initialView: ViewType) {
  return createStore<ViewState>((set, get) => ({
    view: initialView,
    setView: (view) => {
      persistViewCookie(view);
      if (get().view === view) {
        return;
      }
      set({ view });
    },
  }));
}

const ViewStoreContext = createContext<ViewStore | null>(null);

export interface ViewStoreProviderProps {
  initialView: ViewType;
  children: ReactNode;
}

export function ViewStoreProvider({
  initialView,
  children,
}: ViewStoreProviderProps) {
  const storeRef = useRef<ViewStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createViewStore(initialView);
  }

  return (
    <ViewStoreContext.Provider value={storeRef.current}>
      {children}
    </ViewStoreContext.Provider>
  );
}

export function useView(): ViewType {
  const store = useContext(ViewStoreContext);

  if (!store) {
    throw new Error("useView must be used within ViewStoreProvider");
  }

  return useStore(store, (state) => state.view);
}

export function useSetView(): ViewState["setView"] {
  const store = useContext(ViewStoreContext);

  if (!store) {
    throw new Error("useSetView must be used within ViewStoreProvider");
  }

  return useStore(store, (state) => state.setView);
}
