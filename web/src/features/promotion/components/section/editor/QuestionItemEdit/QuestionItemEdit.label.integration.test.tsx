import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { QuestionItemEdit } from "./index";
import type { PromotionDraftQuestion } from "../../../../types";

const textQuestion: PromotionDraftQuestion = {
  clientTempId: "q-text",
  questionType: "TEXT",
  label: "",
  required: false,
  orderNo: 1,
  settingsJson: "{}",
  options: [],
};

describe("PROMO-015 | 홍보 설문 작성 - 질문 추가/유형 및 제목 검증", () => {
  afterEach(() => {
    cleanup();
  });

  it("질문 제목을 비운 상태로 [저장] 선택", async () => {
    // 5. 질문 제목을 비운 상태로 [저장] 선택
    const user = userEvent.setup({ delay: null });
    const updateQuestion = vi.fn();
    render(
      <QuestionItemEdit
        question={textQuestion}
        questionIndex={0}
        totalQuestions={1}
        onBlur={vi.fn()}
        isPersistedQuestion={false}
        updateQuestion={updateQuestion}
        moveQuestion={vi.fn()}
        deleteQuestion={vi.fn()}
      />
    );

    await user.type(screen.getByLabelText("질문"), "임시");
    await user.clear(screen.getByLabelText("질문"));

    expect(
      await screen.findByText("질문을 입력해주세요.")
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "저장" })).toBeDisabled();
    expect(updateQuestion).not.toHaveBeenCalled();
  });
});
