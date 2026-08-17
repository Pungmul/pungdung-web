import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { server } from "@/test/msw-server";

import { AUTH_VALIDATION } from "../../constants";
import { AccountStep } from "./AccountStep";
import { wrapSignUpStep } from "./email-sign-up-test-harness";

describe("AUTH-005 | 이메일 회원가입 - 중복 이메일", () => {
  const onSubmit = vi.fn();
  let checkEmailCount = 0;

  beforeEach(() => {
    onSubmit.mockReset();
    checkEmailCount = 0;
    server.use(
      http.post(
        ({ request }) =>
          new URL(request.url).pathname === "/api/auth/sign-up/check-email",
        () => {
          checkEmailCount += 1;
          return HttpResponse.json({
            code: "SUCCESS",
            message: "ok",
            response: { isRegistered: true },
            isSuccess: true,
          });
        }
      )
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("이미 가입된 이메일을 입력하고 포커스를 옮김", async () => {
    // 1. 이메일 계정 정보 화면 진입
    // 2. 이미 사용 중인 이메일 입력 후 blur
    const user = userEvent.setup({ delay: null });
    render(
      wrapSignUpStep(
        <AccountStep onSubmit={onSubmit} onPrevStep={vi.fn()} />
      )
    );

    await user.type(screen.getByLabelText("이메일"), "user@test.com");
    await user.tab();

    expect(
      await screen.findByText(AUTH_VALIDATION.EMAIL.ALREADY_REGISTERED)
    ).toBeVisible();
    expect(checkEmailCount).toBe(1);
    expect(
      screen.getByRole("button", { name: "모든 필드를 입력해주세요" })
    ).toBeDisabled();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
