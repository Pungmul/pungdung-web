import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAccountStepForm } from "./useAccountStepForm";
import { AUTH_VALIDATION, SIGN_UP_FORM_FIELD } from "../../constants";

const {
  triggerMock,
  clearErrorsMock,
  setErrorMock,
  getValuesMock,
  refetchMock,
  useFormContextMock,
  useFormStateMock,
  useWatchMock,
  useQueryMock,
} = vi.hoisted(() => ({
  triggerMock: vi.fn(),
  clearErrorsMock: vi.fn(),
  setErrorMock: vi.fn(),
  getValuesMock: vi.fn(),
  refetchMock: vi.fn(),
  useFormContextMock: vi.fn(),
  useFormStateMock: vi.fn(),
  useWatchMock: vi.fn(),
  useQueryMock: vi.fn(),
}));

vi.mock("react-hook-form", () => ({
  useFormContext: useFormContextMock,
  useFormState: useFormStateMock,
  useWatch: useWatchMock,
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: useQueryMock,
  };
});

describe("useAccountStepForm", () => {
  const ACCOUNT_FIELDS = SIGN_UP_FORM_FIELD.ACCOUNT;

  beforeEach(() => {
    vi.clearAllMocks();
    useFormContextMock.mockReturnValue({
      register: vi.fn(),
      trigger: triggerMock,
      clearErrors: clearErrorsMock,
      setError: setErrorMock,
      getValues: getValuesMock,
      control: {},
    });
    useFormStateMock.mockReturnValue({
      errors: {},
    });
    useWatchMock.mockReturnValue(["user@test.com", "Password12", "Password12"]);
    useQueryMock.mockReturnValue({
      refetch: refetchMock,
      isFetching: false,
    });
    getValuesMock.mockReturnValue({
      email: "user@test.com",
      password: "Password12",
      confirmPassword: "Password12",
    });
  });

  it("이메일 검증 실패 시 중복 확인 API를 호출하지 않는다", async () => {
    triggerMock.mockResolvedValue(false);
    const { result } = renderHook(() => useAccountStepForm());

    await result.current.emailRegisterOptions.onBlur?.({} as never);

    expect(refetchMock).not.toHaveBeenCalled();
  });

  it("중복 이메일이면 이메일 필드에 검증 에러를 설정한다", async () => {
    triggerMock.mockResolvedValue(true);
    refetchMock.mockResolvedValue({ data: { isRegistered: true } });
    const { result } = renderHook(() => useAccountStepForm());

    await result.current.emailRegisterOptions.onBlur?.({} as never);

    expect(setErrorMock).toHaveBeenCalledWith(ACCOUNT_FIELDS.EMAIL, {
      type: "validate",
      message: AUTH_VALIDATION.EMAIL.ALREADY_REGISTERED,
    });
  });

  it("submitAccountStep은 전체 필드 검증 실패 시 onValid를 호출하지 않는다", async () => {
    triggerMock.mockResolvedValue(false);
    const { result } = renderHook(() => useAccountStepForm());
    const onValid = vi.fn();

    await result.current.submitAccountStep(onValid);

    expect(onValid).not.toHaveBeenCalled();
  });

  it("submitAccountStep은 전체 필드 검증 성공 시 현재 값을 전달한다", async () => {
    triggerMock.mockResolvedValue(true);
    const { result } = renderHook(() => useAccountStepForm());
    const onValid = vi.fn();

    await result.current.submitAccountStep(onValid);

    expect(onValid).toHaveBeenCalledWith({
      email: "user@test.com",
      password: "Password12",
      confirmPassword: "Password12",
    });
  });
});
