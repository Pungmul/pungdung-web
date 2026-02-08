import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useEmailCheckForm } from "./useEmailCheckForm";
import { AUTH_DOMAIN_MESSAGE, AUTH_VALIDATION } from "../../constants";

const {
  refetchMock,
  setErrorMock,
  requestPasswordResetEmailMock,
  useFormMock,
  useWatchMock,
  useQueryMock,
  useMutationMock,
} = vi.hoisted(() => ({
  refetchMock: vi.fn(),
  setErrorMock: vi.fn(),
  requestPasswordResetEmailMock: vi.fn(),
  useFormMock: vi.fn(),
  useWatchMock: vi.fn(),
  useQueryMock: vi.fn(),
  useMutationMock: vi.fn(),
}));

vi.mock("react-hook-form", () => ({
  useForm: useFormMock,
  useWatch: useWatchMock,
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: useQueryMock,
    useMutation: useMutationMock,
  };
});

describe("useEmailCheckForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFormMock.mockReturnValue({
      register: vi.fn(),
      control: {},
      handleSubmit: vi.fn(),
      setError: setErrorMock,
      formState: { errors: {}, isValid: true },
    });
    useWatchMock.mockReturnValue("test@example.com");
    useQueryMock.mockReturnValue({
      refetch: refetchMock,
      isFetching: false,
    });
    useMutationMock.mockImplementation(() => ({
      mutate: requestPasswordResetEmailMock,
      isPending: false,
    }));
  });

  it("이메일 중복 확인에서 가입된 이메일이면 입력 에러를 설정한다", async () => {
    refetchMock.mockResolvedValue({ data: { isRegistered: true } });
    const { result } = renderHook(() =>
      useEmailCheckForm({ onSuccess: vi.fn() })
    );

    await result.current.emailRegisterOptions.onBlur?.({} as never);

    expect(setErrorMock).toHaveBeenCalledWith("email", {
      type: "validate",
      message: AUTH_VALIDATION.EMAIL_CHECK.NOT_REGISTERED,
    });
  });

  it("이메일 중복 확인 요청 실패 시 공통 에러 메시지를 설정한다", async () => {
    refetchMock.mockRejectedValue(new Error("network"));
    const { result } = renderHook(() =>
      useEmailCheckForm({ onSuccess: vi.fn() })
    );

    await result.current.emailRegisterOptions.onBlur?.({} as never);

    expect(setErrorMock).toHaveBeenCalledWith("email", {
      type: "validate",
      message: AUTH_VALIDATION.UNKNOWN_ERROR,
    });
  });

  it("onSubmit은 비밀번호 재설정 메일 요청 mutation을 호출한다", () => {
    const { result } = renderHook(() =>
      useEmailCheckForm({ onSuccess: vi.fn() })
    );

    result.current.onSubmit({ email: "test@example.com" });

    expect(requestPasswordResetEmailMock).toHaveBeenCalledWith({
      email: "test@example.com",
    });
  });

  it("mutation 에러 핸들러는 입력 에러를 수동 설정한다", () => {
    let capturedOnError: ((error: Error) => void) | undefined;
    useMutationMock.mockImplementation(
      (options: { onError: (error: Error) => void }) => {
        capturedOnError = options.onError;
        return { mutate: requestPasswordResetEmailMock, isPending: false };
      }
    );

    renderHook(() => useEmailCheckForm({ onSuccess: vi.fn() }));

    capturedOnError?.(new Error(""));

    expect(setErrorMock).toHaveBeenCalledWith("email", {
      type: "manual",
      message: AUTH_DOMAIN_MESSAGE.RESET_PASSWORD.ERROR,
    });
  });
});
