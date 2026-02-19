import { beforeEach, describe, expect, it } from "vitest";

import { useFrequentBoard } from "./frequent-board.store";

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

  it("removeBoard는 해당 항목만 제거한다", () => {
    const { visitBoard, removeBoard } = useFrequentBoard.getState();
    visitBoard({ id: 1, name: "A" });
    visitBoard({ id: 2, name: "B" });
    removeBoard({ id: 1, name: "A" });

    expect(useFrequentBoard.getState().boardList).toEqual([
      { id: 2, name: "B" },
    ]);
  });
});
