import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FrequentBoardItem {
  id: number;
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
        nextBoardList.unshift(board);

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
