import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ToastHost } from "@/shared/components";
import { ViewStoreProvider } from "@/shared/lib/view/view-store-provider";
import { toastStore } from "@/shared/store";
import { server } from "@/test/msw-server";

import { reportPostStore } from "../../store";
import { ReportPostModal } from "./ReportPostModal";

function renderReportModal() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <ViewStoreProvider initialView="mobile">
      <QueryClientProvider client={queryClient}>
        <ToastHost />
        <ReportPostModal />
      </QueryClientProvider>
    </ViewStoreProvider>
  );
}

describe("BOARD-092 | 게시글 신고 - 사유 미선택", () => {
  let reportRequestCount = 0;

  beforeEach(() => {
    reportRequestCount = 0;
    toastStore.getState().hide();
    reportPostStore.setState({
      isModalOpen: true,
      reportedPost: {
        postId: 7,
        title: "글",
        author: "작성자",
      },
    });
    server.use(
      http.post(
        ({ request }) =>
          new URL(request.url).pathname === "/api/posts/7/report",
        () => {
          reportRequestCount += 1;
          return HttpResponse.json({
            code: "SUCCESS",
            message: "ok",
            response: null,
            isSuccess: true,
          });
        }
      )
    );
  });

  afterEach(() => {
    toastStore.getState().hide();
    reportPostStore.setState({
      reportedPost: null,
      isModalOpen: false,
    });
    cleanup();
  });

  it("신고 사유를 고르지 않고 제출", async () => {
    // 1. 신고 모달 오픈
    // 2. 사유 미선택
    // 3. 제출 시도
    // 제품은 사유 미선택 시 제출 버튼 disable. 스키마 문구는 화면에 없음
    renderReportModal();

    expect(await screen.findByText("제목: 글")).toBeVisible();
    const submitButton = screen.getByRole("button", { name: "신고하기" });
    expect(submitButton).toBeDisabled();

    const form = submitButton.closest("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    expect(reportRequestCount).toBe(0);
    expect(screen.queryByText("신고가 접수되었습니다.")).not.toBeInTheDocument();
  });
});
