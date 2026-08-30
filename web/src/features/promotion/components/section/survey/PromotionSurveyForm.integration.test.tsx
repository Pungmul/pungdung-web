import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PromotionSurveyForm } from "./PromotionSurveyForm";
import type {
  PromotionJoinedFriend,
  PromotionPublishedQuestion,
} from "../../../types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const requiredTextQuestion: PromotionPublishedQuestion = {
  id: 11,
  questionType: "TEXT",
  label: "관람 이유",
  required: true,
  orderNo: 1,
  settingsJson: "{}",
  options: [],
};

const joinedFriend: PromotionJoinedFriend = {
  userId: 1,
  username: "friend@example.com",
  name: "공연 친구",
  clubName: "풍덩대",
  profileImage: {
    id: 1,
    originalFilename: "profile.png",
    convertedFileName: "user/1/profile.png",
    fullFilePath: "https://example.com/profile.png",
    fileType: "image/png",
    fileSize: 1,
    createdAt: "2026-09-22T00:00:00",
  },
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

  it("신청한 친구 안내를 누르면 친구 목록을 연다", async () => {
    const user = userEvent.setup();

    render(
      <PromotionSurveyForm
        questions={[requiredTextQuestion]}
        joinedFriends={[joinedFriend]}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "1명의 친구들이 이 공연 관람을 신청했어요",
      })
    );

    expect(
      screen.getByRole("region", { name: "공연 관람 신청 친구 목록" })
    ).toBeInTheDocument();
    expect(screen.getByText("공연 친구", { exact: true })).toBeInTheDocument();
    expect(
      screen.getByText("friend@example.com", { exact: true })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "필수 응답 항목을 모두 입력해주세요. (1번 질문)",
      })
    ).toBeVisible();
  });
});
