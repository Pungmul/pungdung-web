import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PromotionSurveyForm } from "./index";
import type { PromotionPublishedQuestion } from "../../../../types";

const requiredChoiceQuestion: PromotionPublishedQuestion = {
  id: 21,
  questionType: "CHOICE",
  label: "선호 좌석",
  required: true,
  orderNo: 1,
  settingsJson: "{}",
  options: [
    { id: 1, label: "A열", orderNo: 1 },
    { id: 2, label: "B열", orderNo: 2 },
  ],
};

describe("PROMO-037 | 관람 신청 - 객관식 필수 미응답", () => {
  afterEach(() => {
    cleanup();
  });

  it("필수 객관식 질문을 미응답 상태로 둠", async () => {
    // 1. 관람 신청 화면 진입
    // 2. 필수 CHOICE 질문을 고르지 않음
    // 3. 하단 제출 영역 확인
    // PROMO-010은 TEXT 필수. 이 파일은 CHOICE 필수만 본다
    const onSubmit = vi.fn();
    const { container } = render(
      <PromotionSurveyForm
        questions={[requiredChoiceQuestion]}
        onSubmit={onSubmit}
      />
    );

    const submitButton = screen.getByRole("button", {
      name: "필수 응답 항목을 모두 입력해주세요. (1번 질문)",
    });
    expect(submitButton).toBeDisabled();

    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    expect(
      await screen.findByText("이 질문은 필수 응답 항목입니다.")
    ).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
