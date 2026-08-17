import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ViewStoreProvider } from "@/shared/lib/view/view-store-provider";

import { BoardList } from "./index";
import type { BoardSummary } from "../../../types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/board",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const boards: BoardSummary[] = [
  {
    id: 1,
    parentId: null,
    name: "자유게시판",
    description: "",
    isPublic: true,
  },
  {
    id: 2,
    parentId: null,
    name: "악기 게시판",
    description: "",
    isPublic: true,
  },
];

describe("BOARD-105 | 게시판 메인 - 즐겨찾기 등록/해제", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("일반 게시판 하나를 즐겨찾기 등록 후 해제", async () => {
    // 1. 게시판 메인 진입
    // 2. 일반 게시판 하나를 즐겨찾기 등록
    // 4. 같은 게시판의 즐겨찾기 해제
    const user = userEvent.setup({ delay: null });
    render(
      <ViewStoreProvider initialView="mobile">
        <BoardList boardList={boards} isGuest={false} />
      </ViewStoreProvider>
    );

    const bookmark = screen.getByRole("button", {
      name: "악기 게시판 즐겨찾기",
    });
    await user.click(bookmark);
    expect(bookmark).toHaveAttribute("aria-pressed", "true");

    const items = screen.getAllByRole("listitem");
    expect(within(items[0]!).getByText("악기 게시판")).toBeVisible();

    await user.click(bookmark);
    expect(bookmark).toHaveAttribute("aria-pressed", "false");
  });
});
