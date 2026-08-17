import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AUTH_VALIDATION } from "../../constants";
import { AccountStep } from "./AccountStep";
import { wrapSignUpStep } from "./email-sign-up-test-harness";

describe("AUTH-018 | 이메일 회원가입 - 비밀번호 정책 검증", () => {
  afterEach(() => {
    cleanup();
  });

  it("최소 길이 미만 입력", async () => {
    // 1. 계정 설정 화면 진입
    // 3. 최소 길이 미만 입력
    // 길이 조합 전수는 account.schema unit
    const user = userEvent.setup({ delay: null });
    render(
      wrapSignUpStep(
        <AccountStep onSubmit={vi.fn()} onPrevStep={vi.fn()} />
      )
    );

    await user.type(screen.getByLabelText("비밀번호"), "short!");
    await user.tab();

    expect(
      screen.getByText(AUTH_VALIDATION.PASSWORD.LENGTH_8_TO_12)
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "모든 필드를 입력해주세요" })
    ).toBeDisabled();
  });
});
