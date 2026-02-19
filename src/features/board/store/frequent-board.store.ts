import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BoardItem {
  id: number;
  name: string;
}

interface FrequentBoardStore {
  boardList: BoardItem[];
  visitBoard: (board: BoardItem) => void;
  removeBoard: (board: BoardItem) => void;
}

const useFrequentBoard = create<FrequentBoardStore>()(
  persist(
    (set, get) => ({
      boardList: [],
      visitBoard: (board: BoardItem) => {
        //맨앞이 최신값
        const currentBoardList = get().boardList;

        const newBoardList = [...currentBoardList].filter(
          (b) => b.id !== board.id
        );
        newBoardList.unshift(board);

        set({ boardList: newBoardList });
      },
      removeBoard: (board: BoardItem) => {
        const currentBoardList = get().boardList;
        const newBoardList = currentBoardList.filter(
          (b) => b.id !== board.id
        );
        set({ boardList: newBoardList });
      },
    }),
    {
      name: "frequentBoardList",
      partialize: (state) => ({ boardList: state.boardList }),
    }
  )
);

export { useFrequentBoard };
