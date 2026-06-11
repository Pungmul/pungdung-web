import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor, act } from "@testing-library/react";
import type { SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { postQueries } from "@/features/post";
import { Toast } from "@/shared/store";

import type { ReportCommentFormValues } from "../form";
import * as CommentApi from "../../api/client";
import { reportCommentStore } from "../../store/reportCommentStore";

import { useReportCommentAction } from "./useReportCommentAction";

function makeHandleSubmit(
  values: ReportCommentFormValues
): UseFormHandleSubmit<ReportCommentFormValues> {
  return ((onValid: SubmitHandler<ReportCommentFormValues>) =>
    async () => {
      await onValid(values);
    }) as unknown as UseFormHandleSubmit<ReportCommentFormValues>;
}

describe("useReportCommentAction", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    reportCommentStore.setState({
      reportedComment: null,
      isModalOpen: false,
    });

    vi.spyOn(CommentApi, "reportComment").mockResolvedValue(undefined as never);
    vi.spyOn(Toast, "show");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("신고 대상이 없으면 신고 요청을 보내지 않는다", async () => {
    reportCommentStore.setState({
      reportedComment: null,
      isModalOpen: false,
    });

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const closeModal = vi.fn();

    const { result } = renderHook(
      () =>
        useReportCommentAction({
          closeModal,
          handleSubmit: makeHandleSubmit({ reportReason: "OTHER" }),
        }),
      { wrapper }
    );

    await act(async () => {
      await result.current.handleReportSubmit();
    });

    expect(CommentApi.reportComment).not.toHaveBeenCalled();
    expect(closeModal).not.toHaveBeenCalled();
    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it("성공하면 전체 게시글 상세를 무효화하고 성공 토스트·모달을 닫는다", async () => {
    reportCommentStore.setState({
      reportedComment: {
        commentId: 15,
        content: "bad",
        userName: "u",
      },
      isModalOpen: true,
    });

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const closeModal = vi.fn();

    const { result } = renderHook(
      () =>
        useReportCommentAction({
          closeModal,
          handleSubmit: makeHandleSubmit({ reportReason: "SPAM" }),
        }),
      { wrapper }
    );

    await act(async () => {
      await result.current.handleReportSubmit();
    });

    expect(vi.mocked(CommentApi.reportComment).mock.calls[0]?.[0]).toEqual({
      commentId: 15,
      selectedOption: "SPAM",
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: postQueries.details(),
      });
      expect(Toast.show).toHaveBeenCalledWith({
        message: "신고가 접수되었습니다.",
      });
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("실패하면 실패 토스트를 띄운다", async () => {
    reportCommentStore.setState({
      reportedComment: {
        commentId: 2,
        content: "c",
        userName: "u",
      },
      isModalOpen: true,
    });

    vi.spyOn(CommentApi, "reportComment").mockRejectedValueOnce(
      new Error("fail")
    );

    const { result } = renderHook(
      () =>
        useReportCommentAction({
          closeModal: vi.fn(),
          handleSubmit: makeHandleSubmit({ reportReason: "OTHER" }),
        }),
      { wrapper }
    );

    await act(async () => {
      await expect(result.current.handleReportSubmit()).rejects.toThrow("fail");
    });

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        message: "신고 접수에 실패했습니다.",
      });
    });
  });
});
