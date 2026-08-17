import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { wrapSignUpStep } from "./email-sign-up-test-harness";
import { TermsStep } from "./TermsStep";

describe("AUTH-020 | 이메일 회원가입 - 필수 약관 미동의", () => {
  afterEach(() => {
    cleanup();
  });

  it("필수 약관 중 하나만 선택하면 다음이 막힌다", async () => {
    // 1. 회원가입 약관 동의 화면 진입
    // 2. 필수 약관 중 하나만 선택
    // 3. [다음] 버튼 상태 확인
    const user = userEvent.setup({ delay: null });
    const onSubmit = vi.fn();
    render(wrapSignUpStep(<TermsStep onSubmit={onSubmit} />));

    await user.click(
      screen.getByRole("checkbox", { name: /이용 약관에 동의합니다/ })
    );

    expect(
      screen.getByRole("button", { name: "약관에 동의해주세요" })
    ).toBeDisabled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("남은 필수 약관 선택 후 다음이 열린다", async () => {
    // 4. 남은 필수 약관 선택
    // 5. [다음] 버튼 상태 확인
    const user = userEvent.setup({ delay: null });
    render(wrapSignUpStep(<TermsStep onSubmit={vi.fn()} />));

    await user.click(
      screen.getByRole("checkbox", { name: /이용 약관에 동의합니다/ })
    );
    await user.click(
      screen.getByRole("checkbox", { name: /개인정보 이용에 동의합니다/ })
    );

    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled();
  });
});
