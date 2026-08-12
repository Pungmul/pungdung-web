import { beforeEach, describe, expect, it } from "vitest";

import {
  frequentBoardItemKey,
  useFrequentBoard,
} from "./frequent-board.store";

describe("frequent-board store", () => {
  beforeEach(() => {
    localStorage.clear();
    useFrequentBoard.setState({ boardList: [] });
  });

  it("visitBoard는 최근 방문을 맨 앞에 둔다", () => {
    const { visitBoard } = useFrequentBoard.getState();
    visitBoard({ id: 1, name: "A" });
    visitBoard({ id: 2, name: "B" });

    expect(useFrequentBoard.getState().boardList).toEqual([
      { id: 2, name: "B" },
      { id: 1, name: "A" },
    ]);
  });

  it("같은 id를 다시 방문하면 중복 없이 맨 앞으로 옮긴다", () => {
    const { visitBoard } = useFrequentBoard.getState();
    visitBoard({ id: 1, name: "A" });
    visitBoard({ id: 2, name: "B" });
    visitBoard({ id: 1, name: "A" });

    expect(useFrequentBoard.getState().boardList).toEqual([
      { id: 1, name: "A" },
      { id: 2, name: "B" },
    ]);
  });

  it("같은 id와 tabId면 칩을 하나 두고 이름만 갱신한다", () => {
    const { visitBoard } = useFrequentBoard.getState();
    visitBoard({ id: 10, tabId: 201, name: "장구" });
    visitBoard({ id: 11, name: "자유" });
    visitBoard({ id: 10, tabId: 201, name: "장구 게시판" });

    expect(useFrequentBoard.getState().boardList).toEqual([
      { id: 10, tabId: 201, name: "장구 게시판" },
      { id: 11, name: "자유" },
    ]);
  });

  it("같은 루트의 다른 tabId는 별도 칩이다", () => {
    const { visitBoard } = useFrequentBoard.getState();
    visitBoard({ id: 10, tabId: 201, name: "장구" });
    visitBoard({ id: 10, tabId: 202, name: "북" });

    expect(useFrequentBoard.getState().boardList).toEqual([
      { id: 10, tabId: 202, name: "북" },
      { id: 10, tabId: 201, name: "장구" },
    ]);
  });

  it("tabId 없는 기존 항목은 같은 루트 탭과 다른 키다", () => {
    expect(frequentBoardItemKey({ id: 10, name: "악기" })).toBe("10:");
    expect(
      frequentBoardItemKey({ id: 10, tabId: 201, name: "장구" })
    ).toBe("10:201");
  });

  it("removeBoard는 같은 id+tabId만 제거한다", () => {
    const { visitBoard, removeBoard } = useFrequentBoard.getState();
    visitBoard({ id: 10, tabId: 201, name: "장구" });
    visitBoard({ id: 10, tabId: 202, name: "북" });
    removeBoard({ id: 10, tabId: 201, name: "장구" });

    expect(useFrequentBoard.getState().boardList).toEqual([
      { id: 10, tabId: 202, name: "북" },
    ]);
  });
});
