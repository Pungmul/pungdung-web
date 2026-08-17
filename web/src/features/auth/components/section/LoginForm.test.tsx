import React from "react";

import { UseFormRegister } from "react-hook-form";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { FormEvent } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LoginForm, type LoginFormProps } from "./LoginForm";

import "@testing-library/jest-dom/vitest";

const validCredentials = {
  loginId: "user@test.com",
  password: "Password12",
} as const;

// RHF handleSubmit과 동일
// submit에서 검증된 payload로 onValidSubmit 호출
function mockHandleSubmit(
  onValidSubmit: (data: typeof validCredentials) => void
): (submitEvent: FormEvent<HTMLFormElement>) => void {
  return (submitEvent) => {
    submitEvent.preventDefault();
    onValidSubmit({ ...validCredentials });
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
    handleSubmit: (onValidSubmit: (data: typeof validCredentials) => void) =>
      mockHandleSubmit(onValidSubmit),
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
    const errorWithEmptyMessage = new Error("");
    errorWithEmptyMessage.message = "";

    render(<LoginForm {...baseProps({ requestError: errorWithEmptyMessage })} />);

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
    render(<LoginForm {...baseProps({ isPending: true })} />);

    const submitButton = screen.getByRole("button", { name: "로그인" });

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-busy", "true");
    expect(submitButton.querySelector(".animate-spin")).not.toBeNull();
    expect(submitButton).not.toHaveTextContent("로그인");
  });

  it("비밀번호 보기 버튼이 있고 누르면 비밀번호 숨기기로 이름이 바뀐다", () => {
    render(<LoginForm {...baseProps()} />);

    const passwordInput = screen.getByLabelText("비밀번호");
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "비밀번호 보기" }));

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "비밀번호 숨기기" })
    ).toBeInTheDocument();
  });
});
