import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FrequentBoardItem {
  id: number | "promote";
  tabId?: number;
  name: string;
}

interface FrequentBoardStore {
  boardList: FrequentBoardItem[];
  visitBoard: (board: FrequentBoardItem) => void;
  removeBoard: (board: FrequentBoardItem) => void;
}

export function frequentBoardItemKey(board: FrequentBoardItem): string {
  return `${board.id}:${board.tabId ?? ""}`;
}

const useFrequentBoard = create<FrequentBoardStore>()(
  persist(
    (set, get) => ({
      boardList: [],
      visitBoard: (board: FrequentBoardItem) => {
        // 맨 앞이 최신값
        const currentBoardList = get().boardList;
        const visitKey = frequentBoardItemKey(board);
        const nextBoardList = currentBoardList.filter(
          (item) => frequentBoardItemKey(item) !== visitKey
        );
        const name = board.name.replace(/게시판/g, "").trim().replace(/^\S+(?:대학교|대학|학교|대)\s+/, "").trim();
        nextBoardList.unshift({ ...board, name: name ? `${name} 게시판` : "게시판" });

        set({ boardList: nextBoardList });
      },
      removeBoard: (board: FrequentBoardItem) => {
        const currentBoardList = get().boardList;
        const removeKey = frequentBoardItemKey(board);
        const nextBoardList = currentBoardList.filter(
          (item) => frequentBoardItemKey(item) !== removeKey
        );
        set({ boardList: nextBoardList });
      },
    }),
    {
      name: "frequentBoardList",
      partialize: (state) => ({ boardList: state.boardList }),
    }
  )
);

export { useFrequentBoard };
