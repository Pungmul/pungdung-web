import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useChangePasswordForm } from "./useChangePasswordForm";

const { replaceMock, mutateMock, useMutationMock, useFormMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  mutateMock: vi.fn(),
  useMutationMock: vi.fn(),
  useFormMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useMutation: useMutationMock,
  };
});

vi.mock("react-hook-form", () => ({
  useForm: useFormMock,
}));

describe("useChangePasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFormMock.mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn(),
      formState: {
        errors: {},
        isValid: true,
      },
    });
    useMutationMock.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      error: null,
    });
    vi.stubGlobal("alert", vi.fn());
    vi.spyOn(console, "error").mockImplementation(() => { });
  });

  it("비밀번호 변경 성공 시 안내 후 마이페이지로 이동한다", () => {
    const { result } = renderHook(() => useChangePasswordForm());
    const data = {
      currentPassword: "oldPassword12",
      newPassword: "newPassword12",
      confirmPassword: "newPassword12",
    };

    result.current.onSubmit(data);

    expect(mutateMock).toHaveBeenCalledTimes(1);
    const [, options] = mutateMock.mock.calls[0] as [unknown, { onSuccess: () => void }];
    options.onSuccess();

    expect(alert).toHaveBeenCalledWith("비밀번호가 변경되었습니다.");
    expect(replaceMock).toHaveBeenCalledWith("/my-page");
  });

  it("비밀번호 변경 실패 시 에러를 기록하고 실패 알림을 띄운다", () => {
    const { result } = renderHook(() => useChangePasswordForm());
    const data = {
      currentPassword: "oldPassword12",
      newPassword: "newPassword12",
      confirmPassword: "newPassword12",
    };
    const requestError = new Error("failed");

    result.current.onSubmit(data);

    const [, options] = mutateMock.mock.calls[0] as [unknown, { onError: (error: Error) => void }];
    options.onError(requestError);

    expect(console.error).toHaveBeenCalledWith(requestError);
    expect(alert).toHaveBeenCalledWith("비밀번호 변경에 실패했습니다.");
  });
});
