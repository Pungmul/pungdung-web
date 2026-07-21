import React from "react";

import { cleanup, fireEvent, render, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BoardList } from "./BoardList";

const { requestLoginMock } = vi.hoisted(() => ({
  requestLoginMock: vi.fn(),
}));

vi.mock("@/features/auth", () => ({
  useLoginRequiredConfirmAction: () => ({ requestLogin: requestLoginMock }),
}));

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
  { id: 1, parentId: null, name: "Alpha", description: "d1", isPublic: true },
  { id: 2, parentId: null, name: "Bravo", description: "d2", isPublic: false },
] as const;

describe("BoardList", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("localStorage favoriteBoard가 있으면 즐겨찾기 게시판 링크가 먼저 온다", async () => {
    localStorage.setItem("favoriteBoard", JSON.stringify([2]));
    const { container } = render(
      <BoardList boardList={[...boards]} isGuest={false} />
    );

    await waitFor(() => {
      const links = container.querySelectorAll('a[href^="/board/"]');
      expect(links[0]).toHaveTextContent("Bravo");
      expect(links[1]).toHaveTextContent("Alpha");
    });
  });

  it("별 클릭 시 즐겨찾기가 localStorage에 반영된다", async () => {
    const { container } = render(
      <BoardList boardList={[...boards]} isGuest={false} />
    );

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

    const { container } = render(
      <BoardList boardList={[...boards]} isGuest={false} />
    );

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

  it("비로그인 목록은 자유·악기 게시판을 최상단에 두고 나머지 영역에 로그인 안내를 표시한다", () => {
    const boardList = [
      { id: 2, parentId: null, name: "다른 게시판", description: "d1", isPublic: false },
      { id: 6, parentId: null, name: "악기 게시판", description: "d2", isPublic: true },
      { id: 1, parentId: null, name: "자유 게시판", description: "d3", isPublic: true },
      { id: "promote", parentId: null, name: "홍보 게시판", description: "d4", isPublic: true },
    ];
    const { container, getByRole, getByText } = render(
      <BoardList boardList={boardList} isGuest />
    );

    const links = container.querySelectorAll('a[href^="/board/"]');
    expect(links[0]).toHaveTextContent("자유 게시판");
    expect(links[1]).toHaveTextContent("악기 게시판");
    expect(links[2]).toHaveTextContent("홍보 게시판");
    expect(getByText("바로 풍덩 빠져보세요")).toBeInTheDocument();
    expect(getByRole("button", { name: "카카오 로그인" })).toBeInTheDocument();
    expect(getByText("홍보 게시판").closest("ul")).not.toHaveAttribute(
      "inert"
    );
  });

  it("비로그인 잠금 영역은 상호작용에서 제외한다", () => {
    const { getByText } = render(<BoardList boardList={[...boards]} isGuest />);

    expect(getByText("Bravo").closest("ul")).toHaveAttribute("inert");
  });
});
