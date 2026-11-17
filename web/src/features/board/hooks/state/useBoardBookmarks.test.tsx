import { act, renderHook } from "@testing-library/react";
import { expect, it } from "vitest";

import { useBoardBookmarks } from "./useBoardBookmarks";

it("기존 즐겨찾기를 읽고 변경 사항을 같은 저장소에 반영한다", () => {
  localStorage.setItem("favoriteBoard", JSON.stringify([1, "promote"]));
  const { result } = renderHook(() => useBoardBookmarks());
  expect(result.current.ids).toEqual([1, "promote"]);
  act(() => result.current.toggle(1));
  expect(result.current.ids).toEqual(["promote"]);
  expect(JSON.parse(localStorage.getItem("favoriteBoard")!)).toEqual(["promote"]);
  localStorage.setItem("favoriteBoard", JSON.stringify([2]));
  act(() => window.dispatchEvent(new StorageEvent("storage", { key: "favoriteBoard" })));
  expect(result.current.ids).toEqual([2]);
  localStorage.removeItem("favoriteBoard");
});
