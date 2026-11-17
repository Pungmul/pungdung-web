"use client";

import { useEffect } from "react";

import { create } from "zustand";

type BoardId = number | string;

interface BoardBookmarks {
  ids: BoardId[];
  load: () => void;
  toggle: (id: BoardId) => void;
}

const STORAGE_KEY = "favoriteBoard";

const useBoardBookmarksStore = create<BoardBookmarks>((set, get) => ({
  ids: [],
  load: () => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      set({ ids: Array.isArray(value) ? value.filter((id): id is BoardId => typeof id === "number" || typeof id === "string") : [] });
    } catch {
      set({ ids: [] });
    }
  },
  toggle: (id) => {
    const ids = get().ids.includes(id) ? get().ids.filter((item) => item !== id) : [...get().ids, id];
    set({ ids });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  },
}));

export function useBoardBookmarks() {
  const { ids, load, toggle } = useBoardBookmarksStore();

  useEffect(() => {
    load();
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [load]);

  return { ids, toggle };
}
