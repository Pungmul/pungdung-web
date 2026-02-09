import React from "react";

import { UseFormRegister } from "react-hook-form";

import { cleanup,fireEvent, render, screen } from "@testing-library/react";
import type { FormEvent } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LoginForm, type LoginFormProps } from "./LoginForm";

import "@testing-library/jest-dom/vitest";

const validCredentials = {
  loginId: "user@test.com",
  password: "Password12",
} as const;

/** RHF `handleSubmit`과 동일하게: submit 이벤트에서 검증된 payload로 `fn` 호출 */
function mockHandleSubmit(
  fn: (data: typeof validCredentials) => void
): (e: FormEvent<HTMLFormElement>) => void {
  return (e) => {
    e.preventDefault();
    fn({ ...validCredentials });
  };
}

function baseProps(overrides: Partial<LoginFormProps> = {}): LoginFormProps {
  const defaults = {
    register: vi.fn(() => ({})) as unknown as UseFormRegister<{
      loginId: string;
      password: string;
    }>,
    inputErrors: {},
    isValid: true,
    handleSubmit: (fn: (data: typeof validCredentials) => void) =>
      mockHandleSubmit(fn),
    onSubmit: vi.fn(),
    isPending: false,
    requestError: null,
  } as unknown as LoginFormProps;
  return { ...defaults, ...(overrides as LoginFormProps) };
}

afterEach(() => {
  cleanup();
});

describe("LoginForm", () => {
  it("제출 시 onSubmit에 자격 증명을 넘긴다 (form submit — submit 버튼 클릭 없이)", () => {
    const onSubmit = vi.fn();
    const { container } = render(<LoginForm {...baseProps({ onSubmit })} />);

    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ ...validCredentials });
  });

  it("requestError가 있으면 메시지를 보여준다", () => {
    render(
      <LoginForm
        {...baseProps({ requestError: new Error("서버 오류") })}
      />
    );

    expect(screen.getByText("서버 오류")).toBeInTheDocument();
  });

  it("requestError.message가 비어 있으면 기본 실패 문구를 쓴다", () => {
    const err = new Error("");
    err.message = "";

    render(<LoginForm {...baseProps({ requestError: err })} />);

    expect(
      screen.getByText("로그인에 실패했습니다.")
    ).toBeInTheDocument();
  });

  it("inputErrors를 각 필드에 넘긴다", () => {
    render(
      <LoginForm
        {...baseProps({
          inputErrors: {
            loginId: { type: "manual", message: "ID 오류" },
            password: { type: "manual", message: "비번 오류" },
          },
          isValid: false,
        } as Partial<LoginFormProps>)}
      />
    );

    expect(screen.getByText("ID 오류")).toBeInTheDocument();
    expect(screen.getByText("비번 오류")).toBeInTheDocument();
  });

  it("isPending이면 type=submit 버튼을 비활성화하고 스피너를 표시한다", () => {
    const { container } = render(
      <LoginForm {...baseProps({ isPending: true })} />
    );

    const submitBtn = container.querySelector(
      'form button[type="submit"]'
    ) as HTMLButtonElement | null;

    expect(submitBtn).not.toBeNull();
    expect(submitBtn).toBeDisabled();
    expect(submitBtn?.querySelector(".animate-spin")).not.toBeNull();
    expect(submitBtn).not.toHaveTextContent("로그인");
  });
});
