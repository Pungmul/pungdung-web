import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PromotionSurveyForm } from "./index";
import type { PromotionPublishedQuestion } from "../../../../types";

const requiredTextQuestion: PromotionPublishedQuestion = {
  id: 11,
  questionType: "TEXT",
  label: "관람 이유",
  required: true,
  orderNo: 1,
  settingsJson: "{}",
  options: [],
};

describe("PROMO-010 | 관람 신청 - 필수 응답 누락", () => {
  afterEach(() => {
    cleanup();
  });

  it("필수 질문을 미응답 상태로 둠", async () => {
    // 1. 관람 신청 화면 진입
    // 2. 필수 질문을 미응답 상태로 둠
    // 3. 하단 제출 영역 확인
    const onSubmit = vi.fn();
    const { container } = render(
      <PromotionSurveyForm
        questions={[requiredTextQuestion]}
        onSubmit={onSubmit}
      />
    );

    const submitButton = screen.getByRole("button", {
      name: "필수 응답 항목을 모두 입력해주세요. (1번 질문)",
    });
    expect(submitButton).toBeDisabled();

    // disabled 제출 버튼은 userEvent 클릭이 먹지 않음
    // form submit으로 invalid 콜백과 필드 에러를 연다
    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    expect(
      await screen.findByText("이 질문은 필수 응답 항목입니다.")
    ).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
