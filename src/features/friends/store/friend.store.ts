import { create } from "zustand";
import { persist } from "zustand/middleware";

import { FRIEND_SEARCH_HISTORY_STORAGE_KEY } from "../constants";
import {
  type FriendSearchHistoryEntry,
  type FriendSearchHistoryInput,
} from "../types";

interface FriendFilter {
  keyword: string;
}

type FriendSearchHistory = FriendSearchHistoryEntry[];

interface FriendStore {
  friendsFilter: FriendFilter;
  searchHistory: FriendSearchHistory;
  setSearchKeyword: (keyword: string) => void;
  addSearchHistory: (entry: FriendSearchHistoryInput) => void;
  deleteSearchHistory: (entryId: FriendSearchHistoryEntry["id"]) => void;
}

const createKeywordEntry = (
  keyword: string
): FriendSearchHistoryEntry | null => {
  const normalizedKeyword = keyword.trim();

  if (!normalizedKeyword) {
    return null;
  }

  return {
    id: `keyword:${normalizedKeyword.toLowerCase()}`,
    type: "keyword",
    keyword: normalizedKeyword,
  };
};

const createUserEntry = (
  userEntry: Extract<FriendSearchHistoryInput, { type: "user" }>
): FriendSearchHistoryEntry => ({
  id: `user:${userEntry.user.userId}`,
  type: "user",
  user: userEntry.user,
});

export const friendStore = create<FriendStore>()(
  persist(
    (set) => ({
      friendsFilter: {
        keyword: "",
      },
      searchHistory: [],
      setSearchKeyword: (keyword: string) =>
        set({ friendsFilter: { keyword } }),
      addSearchHistory: (entry: FriendSearchHistoryInput) => {
        set((state) => {
          const nextEntry =
            entry.type === "keyword"
              ? createKeywordEntry(entry.keyword)
              : createUserEntry(entry);

          if (!nextEntry) {
            return state;
          }

          const nextHistory = [
            nextEntry,
            ...state.searchHistory.filter(({ id }) => id !== nextEntry.id),
          ];

          return { searchHistory: nextHistory };
        });
      },
      deleteSearchHistory: (entryId: FriendSearchHistoryEntry["id"]) => {
        set((state) => ({
          searchHistory: state.searchHistory.filter(
            (history) => history.id !== entryId
          ),
        }));
      },
    }),
    {
      name: FRIEND_SEARCH_HISTORY_STORAGE_KEY,
      partialize: (state) => ({
        searchHistory: state.searchHistory,
      }),
    }
  )
);
