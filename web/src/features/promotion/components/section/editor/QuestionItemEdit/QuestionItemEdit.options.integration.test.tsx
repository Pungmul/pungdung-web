import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { QuestionItemEdit } from "./index";
import type { PromotionDraftQuestion } from "../../../../types";

const choiceQuestion: PromotionDraftQuestion = {
  clientTempId: "q-choice",
  questionType: "CHOICE",
  label: "선호 좌석",
  required: false,
  orderNo: 1,
  settingsJson: "{}",
  options: [{ label: "A", orderNo: 1 }],
};

describe("PROMO-016 | 홍보 설문 작성 - 객관식/체크리스트 선택지 누락", () => {
  afterEach(() => {
    cleanup();
  });

  it("질문 제목 입력 후 선택지 비워둠", async () => {
    // 1. 객관식 질문 추가
    // 2. 질문 제목 입력 후 선택지 비워둠
    // 3. 질문 [저장] 선택
    const user = userEvent.setup({ delay: null });
    const updateQuestion = vi.fn();
    render(
      <QuestionItemEdit
        question={choiceQuestion}
        questionIndex={0}
        totalQuestions={1}
        onBlur={vi.fn()}
        isPersistedQuestion={false}
        updateQuestion={updateQuestion}
        moveQuestion={vi.fn()}
        deleteQuestion={vi.fn()}
      />
    );

    await user.clear(screen.getByPlaceholderText("선택지 1를 입력해주세요"));
    expect(
      await screen.findByText("선택지를 입력해주세요.")
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "저장" })).toBeDisabled();
    expect(updateQuestion).not.toHaveBeenCalled();
  });
});
