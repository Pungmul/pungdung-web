import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { server } from "@/test/msw-server";

import { AUTH_VALIDATION } from "../../constants";
import { AccountStep } from "./AccountStep";
import { wrapSignUpStep } from "./email-sign-up-test-harness";

describe("AUTH-017 | 이메일 회원가입 - 이메일 입력값 검증", () => {
  const onSubmit = vi.fn();

  beforeEach(() => {
    onSubmit.mockReset();
    server.use(
      http.post(
        ({ request }) =>
          new URL(request.url).pathname === "/api/auth/sign-up/check-email",
        () =>
          HttpResponse.json({
            code: "SUCCESS",
            message: "ok",
            response: { isRegistered: false },
            isSuccess: true,
          })
      )
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("올바르지 않은 이메일 형식 입력", async () => {
    // 1. 이메일 계정 정보 화면 진입
    // 3. 올바르지 않은 이메일 형식 입력
    // 제품 문구는 Notion '올바르지 않아요'가 아니라 AUTH_VALIDATION.EMAIL.INVALID_FORMAT
    const user = userEvent.setup({ delay: null });
    render(
      wrapSignUpStep(
        <AccountStep onSubmit={onSubmit} onPrevStep={vi.fn()} />
      )
    );

    const emailInput = screen.getByLabelText("이메일");
    await user.type(emailInput, "not-an-email");
    await user.tab();

    expect(
      screen.getByText(AUTH_VALIDATION.EMAIL.INVALID_FORMAT)
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "모든 필드를 입력해주세요" })
    ).toBeDisabled();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
