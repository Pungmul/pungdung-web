import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { validatePromotionPublish } from "./validate-promotion-publish";
import { PROMOTION_DESCRIPTION_EXAMPLE } from "../constants/promotion-description";
import type { PromotionDraftQuestion, PromotionPostingFormValues } from "../types";

const now = dayjs("2026-09-10T12:00:00");

const validValues = (): PromotionPostingFormValues => ({
  title: "여름 공연",
  address: { latitude: 37.5, longitude: 127, detail: "B1", buildingName: "홀" },
  date: "2026-09-20",
  time: "19:00",
  closeAt: "",
  limitPersonnel: 30,
  isUnlimitedPersonnel: false,
  poster: null,
  questions: [{ clientTempId: "q1" } as PromotionDraftQuestion],
  descriptionSeed: "",
});

const validate = (
  patch: Partial<PromotionPostingFormValues> = {},
  { descriptionMarkdown = "공연 소개 본문", hasQuestionDraft = false } = {}
) =>
  validatePromotionPublish({
    values: { ...validValues(), ...patch },
    descriptionMarkdown,
    hasQuestionDraft,
    now,
  });

describe("validatePromotionPublish", () => {
  it("모든 항목이 채워지면 통과한다", () => {
    expect(validate()).toEqual({ ok: true });
  });

  it.each<[string, Partial<PromotionPostingFormValues>]>([
    ["title", { title: "  " }],
    ["address", { address: null }],
    ["address", { address: { latitude: 0, longitude: 0, detail: "B1", buildingName: "" } }],
    ["startAt", { time: "" }],
    ["startAt", { date: "2026-09-10", time: "11:00" }],
    ["closeAt", { date: "2026-09-11" }],
    ["limitPersonnel", { limitPersonnel: 0 }],
    ["questions", { questions: [] }],
  ])("%s 누락이면 해당 필드로 실패한다", (field, patch) => {
    expect(validate(patch)).toMatchObject({ ok: false, field });
  });

  it("인원 제한 없음이면 모집 인원을 보지 않는다", () => {
    expect(validate({ isUnlimitedPersonnel: true, limitPersonnel: 0 })).toEqual({
      ok: true,
    });
  });

  it.each(["", "  \n", PROMOTION_DESCRIPTION_EXAMPLE, "### 공연 소개\n***\n여기에 공연 설명을 작성해주세요"])(
    "본문이 비었거나 예시 문구면 실패한다 (%j)",
    (descriptionMarkdown) => {
      expect(validate({}, { descriptionMarkdown })).toMatchObject({
        ok: false,
        field: "description",
      });
    }
  );

  it("작성 중인 질문만 있으면 완료 안내를 보여준다", () => {
    expect(validate({ questions: [] }, { hasQuestionDraft: true })).toEqual({
      ok: false,
      field: "questions",
      message: "작성 중인 질문을 완료해주세요.",
    });
  });
});
