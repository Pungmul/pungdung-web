import React from "react";

import { cleanup, fireEvent, render, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BoardList } from "./BoardList";

vi.mock("@/shared/components", () => ({
  WebViewLink: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    prefetch?: boolean;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const boards = [
  { id: 1, parentId: null, name: "Alpha", description: "d1" },
  { id: 2, parentId: null, name: "Bravo", description: "d2" },
] as const;

describe("BoardList", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("localStorage favoriteBoard가 있으면 즐겨찾기 게시판 링크가 먼저 온다", async () => {
    localStorage.setItem("favoriteBoard", JSON.stringify([2]));
    const { container } = render(<BoardList boardList={[...boards]} />);

    await waitFor(() => {
      const links = container.querySelectorAll('a[href^="/board/"]');
      expect(links[0]).toHaveTextContent("Bravo");
      expect(links[1]).toHaveTextContent("Alpha");
    });
  });

  it("별 클릭 시 즐겨찾기가 localStorage에 반영된다", async () => {
    const { container } = render(<BoardList boardList={[...boards]} />);

    await waitFor(() => {
      expect(localStorage.getItem("favoriteBoard")).not.toBeNull();
    });

    const items = container.querySelectorAll("li");
    expect(items.length).toBe(2);
    const bravoRow = items[1] as HTMLElement;
    const starHit = bravoRow.querySelector(".cursor-pointer");
    expect(starHit).not.toBeNull();

    fireEvent.click(starHit as HTMLElement);

    await waitFor(() => {
      const raw = localStorage.getItem("favoriteBoard");
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!)).toContain(2);
    });
  });

  it("깨진 favoriteBoard JSON이면 항목을 제거하고 목록은 렌더링된다", async () => {
    const removeSpy = vi.spyOn(Storage.prototype, "removeItem");
    localStorage.setItem("favoriteBoard", "not-json");

    const { container } = render(<BoardList boardList={[...boards]} />);

    await waitFor(() => {
      expect(removeSpy).toHaveBeenCalledWith("favoriteBoard");
    });

    await waitFor(() => {
      const links = container.querySelectorAll('a[href^="/board/"]');
      expect(links).toHaveLength(2);
      expect(within(links[0] as HTMLElement).getByText("Alpha")).toBeInTheDocument();
    });

    removeSpy.mockRestore();
  });
});
