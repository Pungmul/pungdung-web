import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AUTH_VALIDATION } from "../../constants";
import { wrapSignUpStep } from "./email-sign-up-test-harness";
import { PersonalStep } from "./PersonalStep";

describe("AUTH-006 | 이메일 회원가입 - 초대코드 검증", () => {
  afterEach(() => {
    cleanup();
  });

  it("초대 코드를 비운 채 다음을 누름", async () => {
    // 1. 프로필 입력 화면 진입
    // 2. 다른 필드는 채우고 초대 코드만 비움
    // 초대코드 전용 검증 API는 제품에 없음. 클라이언트 필드만 본다
    const user = userEvent.setup({ delay: null });
    const onSubmit = vi.fn();
    const { container } = render(
      wrapSignUpStep(
        <PersonalStep onSubmit={onSubmit} onPrevStep={vi.fn()} />
      )
    );

    await user.type(screen.getByLabelText("이름"), "홍길동");
    await user.click(screen.getByRole("button", { name: /소속패/u }));
    await user.click(screen.getByRole("option", { name: "소속패 없음" }));
    await user.type(screen.getByLabelText("학번"), "21");
    await user.type(screen.getByLabelText("전화번호"), "01012345678");

    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    expect(
      await screen.findByText(AUTH_VALIDATION.PERSONAL.INVITE_CODE_REQUIRED)
    ).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("6자리가 아닌 초대 코드를 입력", async () => {
    // 3. 잘못된 자릿수 초대 코드 입력
    const user = userEvent.setup({ delay: null });
    const onSubmit = vi.fn();
    render(
      wrapSignUpStep(
        <PersonalStep onSubmit={onSubmit} onPrevStep={vi.fn()} />
      )
    );

    await user.type(screen.getByLabelText("초대 코드"), "12");
    await user.tab();

    expect(
      await screen.findByText(AUTH_VALIDATION.PERSONAL.INVITE_CODE_DIGITS)
    ).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
