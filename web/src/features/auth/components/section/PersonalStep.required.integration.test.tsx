import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AUTH_VALIDATION } from "../../constants";
import { wrapSignUpStep } from "./email-sign-up-test-harness";
import { PersonalStep } from "./PersonalStep";

describe("AUTH-021 | 이메일 회원가입 - 프로필 필수값 미입력", () => {
  afterEach(() => {
    cleanup();
  });

  it("필수 프로필 항목 중 하나 이상 비워둠", async () => {
    // 1. 회원가입 프로필 입력 화면 진입
    // 2. 필수 프로필 항목 중 하나 이상 비워둠
    // 3. [가입 완료] 또는 [다음] 버튼 클릭
    // 4. 비어 있는 필수 인풋과 버튼 상태 확인
    // 제품은 필수 미완이면 제출 버튼이 비활성
    // form submit으로 trigger 후 필드 문구를 본다
    const onSubmit = vi.fn();
    const { container } = render(
      wrapSignUpStep(
        <PersonalStep onSubmit={onSubmit} onPrevStep={vi.fn()} />
      )
    );

    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    expect(
      await screen.findByText(AUTH_VALIDATION.PERSONAL.NAME_REQUIRED)
    ).toBeVisible();
    expect(
      screen.queryByText("필수 정보를 입력해 주세요")
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "모든 필드를 입력해주세요" })
    ).toBeDisabled();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
