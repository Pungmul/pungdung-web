import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as CommentApi from "../../api/client";
import { reportCommentStore } from "../../store/reportCommentStore";

import { ReportCommentModal } from "./ReportCommentModal";

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

describe("ReportCommentModal", () => {
  beforeEach(() => {
    reportCommentStore.setState({
      reportedComment: null,
      isModalOpen: false,
    });
    vi.spyOn(CommentApi, "reportComment").mockResolvedValue(undefined as never);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("신고 대상이 없으면 아무 것도 렌더하지 않는다", async () => {
    renderWithProviders(<ReportCommentModal />);

    await waitFor(() => {
      expect(screen.queryByText("댓글 신고하기")).not.toBeInTheDocument();
    });
  });

  it("모달 열림 시 사유 미선택이면 신고 버튼이 비활성이다", async () => {
    reportCommentStore.setState({
      isModalOpen: true,
      reportedComment: {
        commentId: 1,
        content: "내용",
        userName: "글쓴이",
      },
    });

    renderWithProviders(<ReportCommentModal />);

    await screen.findByText("댓글 신고하기");

    expect(screen.getByTitle("신고하기")).toBeDisabled();
  });

  it("사유 선택 후 신고 요청 가능하고 pending이면 라벨이 바뀐다", async () => {
    const user = userEvent.setup({ delay: null });

    vi.spyOn(CommentApi, "reportComment").mockImplementation(
      () =>
        new Promise<void>(() => {
          /* 미해결 */
        })
    );

    reportCommentStore.setState({
      isModalOpen: true,
      reportedComment: {
        commentId: 9,
        content: "abc",
        userName: "u",
      },
    });

    renderWithProviders(<ReportCommentModal />);

    await screen.findByText(/댓글 내용:/u);

    await screen.findByText(/댓글 내용:.*abc/u);

    await user.click(screen.getByText("스팸"));
    await user.click(screen.getByTitle("신고하기"));

    await waitFor(() => {
      expect(screen.getByTitle("신고하기")).toBeDisabled();
      expect(screen.getByTitle("신고하기")).toHaveTextContent("신고 중...");
    });

    expect(CommentApi.reportComment).toHaveBeenCalled();
    expect(vi.mocked(CommentApi.reportComment).mock.calls[0]?.[0]).toEqual({
      commentId: 9,
      selectedOption: "SPAM",
    });
  });
});
