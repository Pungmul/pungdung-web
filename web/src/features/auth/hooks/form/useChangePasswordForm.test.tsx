import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useChangePasswordForm } from "./useChangePasswordForm";

const { useFormMock } = vi.hoisted(() => ({
  useFormMock: vi.fn(),
}));

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
  });

  it("changePasswordSchema와 onBlur 모드로 RHF를 초기화한다", () => {
    const { result } = renderHook(() =>
      useChangePasswordForm({ requiresCurrentPassword: true })
    );

    expect(useFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "onBlur",
        defaultValues: {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        },
      })
    );
    expect(result.current.isValid).toBe(true);
    expect(result.current.inputErrors).toEqual({});
  });
});
