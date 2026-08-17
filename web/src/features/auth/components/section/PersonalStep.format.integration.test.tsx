import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AUTH_VALIDATION } from "../../constants";
import { wrapSignUpStep } from "./email-sign-up-test-harness";
import { PersonalStep } from "./PersonalStep";

describe("AUTH-049 | 가입 프로필 형식 안내", () => {
  afterEach(() => {
    cleanup();
  });

  it("한글이 아닌 이름을 입력하면 형식 안내가 보인다", async () => {
    // Notion AUTH-049~053은 v23 키 없음
    // 1. 프로필 입력 화면 진입
    // 2. 한글이 아닌 이름 입력
    // 제품 문구 AUTH_VALIDATION.PERSONAL.NAME_KOREAN만 본다
    const user = userEvent.setup({ delay: null });
    render(
      wrapSignUpStep(
        <PersonalStep onSubmit={vi.fn()} onPrevStep={vi.fn()} />
      )
    );

    await user.type(screen.getByLabelText("이름"), "John");
    await user.tab();

    expect(
      await screen.findByText(AUTH_VALIDATION.PERSONAL.NAME_KOREAN)
    ).toBeVisible();
  });

  it("한 자리 학번을 입력하면 형식 안내가 보인다", async () => {
    // 1. 프로필 입력 화면 진입
    // 2. 한 자리 학번 입력
    const user = userEvent.setup({ delay: null });
    render(
      wrapSignUpStep(
        <PersonalStep onSubmit={vi.fn()} onPrevStep={vi.fn()} />
      )
    );

    await user.type(screen.getByLabelText("학번"), "1");
    await user.tab();

    expect(
      await screen.findByText(AUTH_VALIDATION.PERSONAL.CLUB_AGE_TWO_DIGITS)
    ).toBeVisible();
  });

  it("잘못된 전화번호를 입력하면 형식 안내가 보인다", async () => {
    // 1. 프로필 입력 화면 진입
    // 2. 잘못된 전화번호 입력
    const user = userEvent.setup({ delay: null });
    render(
      wrapSignUpStep(
        <PersonalStep onSubmit={vi.fn()} onPrevStep={vi.fn()} />
      )
    );

    await user.type(screen.getByLabelText("전화번호"), "1234");
    await user.tab();

    expect(
      await screen.findByText(AUTH_VALIDATION.PERSONAL.PHONE_FORMAT)
    ).toBeVisible();
  });
});
