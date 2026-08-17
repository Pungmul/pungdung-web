import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ViewStoreProvider } from "@/shared/lib/view/view-store-provider";

import { Editor } from "./Editor";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    back: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/board",
  useSearchParams: () => new URLSearchParams(),
}));

describe("BOARD-014 | 게시글 작성 - 제목/본문 필수값 검증", () => {
  afterEach(() => {
    cleanup();
  });

  it("제목만 입력하고 본문은 비움", async () => {
    // 1. 게시글 작성 화면 진입
    // 2. 제목만 입력하고 본문은 비움
    // 제품 [저장]은 제목+본문이 있을 때만 버튼
    const user = userEvent.setup({ delay: null });
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    render(
      <ViewStoreProvider initialView="mobile">
        <QueryClientProvider client={queryClient}>
          <Editor boardID={1} />
        </QueryClientProvider>
      </ViewStoreProvider>
    );

    await user.type(
      screen.getByPlaceholderText("제목을 입력하세요"),
      "제목만"
    );

    expect(screen.queryByRole("button", { name: "저장" })).not.toBeInTheDocument();
    expect(screen.getByText("저장")).toBeVisible();
  });
});
