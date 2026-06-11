import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as PostApi from "../../api/client";
import { reportPostStore } from "../../store";

import { ReportPostModal } from "./ReportPostModal";

function renderWithProviders(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
}

describe("ReportPostModal", () => {
  beforeEach(() => {
    reportPostStore.setState({
      reportedPost: null,
      isModalOpen: false,
    });
    vi.spyOn(PostApi, "reportPost").mockResolvedValue(undefined as never);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("신고 대상이 없으면 모달 헤더를 렌더하지 않는다", async () => {
    renderWithProviders(<ReportPostModal />);

    await waitFor(() => {
      expect(screen.queryByText("게시글 신고하기")).not.toBeInTheDocument();
    });
  });

  it("열린 상태에서 사유 미선택이면 제출 버튼이 비활성이다", async () => {
    reportPostStore.setState({
      isModalOpen: true,
      reportedPost: {
        postId: 7,
        title: "글",
        author: "작성자",
      },
    });

    renderWithProviders(<ReportPostModal />);

    await screen.findByText(/제목:/u);

    expect(screen.getByTitle("신고하기")).toBeDisabled();
  });

  it("선택 후 pending이면 제출 레이블이 바뀐다", async () => {
    const user = userEvent.setup({ delay: null });

    vi.spyOn(PostApi, "reportPost").mockImplementation(
      () =>
        new Promise<void>(() => {
          /* pending 유지 */
        })
    );

    reportPostStore.setState({
      isModalOpen: true,
      reportedPost: {
        postId: 3,
        title: "글",
        author: "작성자",
      },
    });

    renderWithProviders(<ReportPostModal />);

    await screen.findByText(/제목:\s*글/u);

    await user.click(screen.getByText("스팸"));

    await user.click(screen.getByTitle("신고하기"));

    await waitFor(() => {
      expect(screen.getByTitle("신고하기")).toHaveTextContent("신고 중...");
    });

    expect(vi.mocked(PostApi.reportPost).mock.calls[0]?.[0]).toMatchObject({
      postId: 3,
      selectedOption: "SPAM",
    });
  });
});
