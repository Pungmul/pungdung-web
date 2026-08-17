import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { server } from "@/test/msw-server";

import { AUTH_VALIDATION } from "../../constants";
import { AccountStep } from "./AccountStep";
import { wrapSignUpStep } from "./email-sign-up-test-harness";

describe("AUTH-019 | 이메일 회원가입 - 비밀번호 확인 검증", () => {
  beforeEach(() => {
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

  it("서로 다른 비밀번호 확인값 입력", async () => {
    // 1. 유효한 비밀번호 입력
    // 3. 서로 다른 비밀번호 확인값 입력
    const user = userEvent.setup({ delay: null });
    render(
      wrapSignUpStep(
        <AccountStep onSubmit={vi.fn()} onPrevStep={vi.fn()} />
      )
    );

    await user.type(screen.getByLabelText("이메일"), "newuser@example.com");
    await user.type(screen.getByLabelText("비밀번호"), "abcd1234!");
    await user.type(screen.getByLabelText("비밀번호 확인"), "other1234!");
    await user.tab();

    expect(screen.getByText(AUTH_VALIDATION.PASSWORD.MISMATCH)).toBeVisible();
    expect(
      screen.getByRole("button", { name: "모든 필드를 입력해주세요" })
    ).toBeDisabled();
  });
});
