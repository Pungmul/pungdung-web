import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useChangePasswordAction } from "./useChangePasswordAction";

const {
  replaceMock,
  mutateMock,
  useMutationMock,
  invalidateQueriesMock,
} = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  mutateMock: vi.fn(),
  useMutationMock: vi.fn(),
  invalidateQueriesMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useMutation: useMutationMock,
    useQueryClient: () => ({
      invalidateQueries: invalidateQueriesMock,
    }),
  };
});

describe("useChangePasswordAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMutationMock.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      error: null,
    });
    vi.stubGlobal("alert", vi.fn());
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("비밀번호 변경 성공 시 invalidate 후 안내하고 마이페이지로 이동한다", async () => {
    const { result } = renderHook(() => useChangePasswordAction());
    const data = {
      currentPassword: "oldPassword12",
      newPassword: "newPassword12",
      confirmPassword: "newPassword12",
    };

    result.current.onSubmit(data);

    expect(mutateMock).toHaveBeenCalledTimes(1);
    const [payload, options] = mutateMock.mock.calls[0] as [
      { currentPassword: string; newPassword: string },
      { onSuccess: () => Promise<void> }
    ];
    expect(payload).toEqual({
      currentPassword: "oldPassword12",
      newPassword: "newPassword12",
    });
    await options.onSuccess();

    expect(invalidateQueriesMock).toHaveBeenCalledTimes(1);
    expect(alert).toHaveBeenCalledWith("비밀번호가 변경되었습니다.");
    expect(replaceMock).toHaveBeenCalledWith("/my-page");
  });

  it("비밀번호 변경 실패 시 에러를 기록한다", () => {
    const { result } = renderHook(() => useChangePasswordAction());
    const data = {
      currentPassword: "oldPassword12",
      newPassword: "newPassword12",
      confirmPassword: "newPassword12",
    };
    const requestError = new Error("failed");

    result.current.onSubmit(data);

    const [, options] = mutateMock.mock.calls[0] as [
      unknown,
      { onError: (error: Error) => void }
    ];
    options.onError(requestError);

    expect(console.error).toHaveBeenCalledWith(requestError);
    expect(alert).not.toHaveBeenCalled();
  });
});
